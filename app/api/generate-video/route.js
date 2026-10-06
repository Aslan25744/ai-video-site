import { v2 as cloudinary } from "cloudinary";

const defaultModel = "bytedance/seedance-1-lite";
const supportedModels = new Set([defaultModel]);
const supportedDurations = new Set([5, 10]);
const supportedAspectRatios = new Set(["16:9", "9:16", "1:1"]);

export const runtime = "nodejs";

function jsonError(message, status) {
	return Response.json({ error: message }, { status });
}

function getCloudName() {
	const value = process.env.CLOUDINARY_URL;
	if (!value) return null;

	try {
		const parsed = new URL(value);
		return parsed.protocol === "cloudinary:" ? parsed.hostname : null;
	} catch {
		return null;
	}
}

function getPredictionVideoUrl(output) {
	const outputs = Array.isArray(output) ? output : [output];
	for (const item of outputs) {
		const candidate =
			typeof item === "string"
				? item
				: item && typeof item === "object"
					? item.url || item.video || item.output
					: null;
		if (typeof candidate !== "string") continue;
		try {
			const url = new URL(candidate);
			if (url.protocol === "https:") return url.toString();
		} catch {}
	}
	return null;
}

async function readReplicateResponse(response) {
	const data = await response.json().catch(() => null);
	if (!response.ok) {
		throw new Error(
			data?.detail || data?.error || "Replicate не смог обработать запрос.",
		);
	}
	return data;
}

async function getPrediction(token, id) {
	const response = await fetch(
		`https://api.replicate.com/v1/predictions/${encodeURIComponent(id)}`,
		{
			headers: { Authorization: `Bearer ${token}` },
			cache: "no-store",
			signal: AbortSignal.timeout(30_000),
		},
	);
	return readReplicateResponse(response);
}

export async function POST(request) {
	const token = process.env.REPLICATE_API_TOKEN;
	const configuredModel =
		process.env.REPLICATE_VIDEO_GENERATION_MODEL || defaultModel;
	if (!token) {
		return jsonError(
			"Добавьте REPLICATE_API_TOKEN в переменные окружения Vercel.",
			503,
		);
	}
	if (!supportedModels.has(configuredModel)) {
		return jsonError(
			"Для выбранной модели пока не настроена схема входных параметров.",
			503,
		);
	}

	const cloudName = getCloudName();
	if (!cloudName) {
		return jsonError(
			"Добавьте CLOUDINARY_URL для передачи изображения модели.",
			503,
		);
	}

	let body;
	try {
		body = await request.json();
	} catch {
		return jsonError("Не удалось прочитать параметры генерации.", 400);
	}

	const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
	const imagePublicId =
		typeof body.imagePublicId === "string" ? body.imagePublicId : "";
	const duration = Number(body.duration);
	const aspectRatio = body.aspectRatio;
	const model = body.model;

	if (!prompt) return jsonError("Введите описание видео.", 400);
	if (prompt.length > 2000) {
		return jsonError("Описание видео не должно превышать 2000 символов.", 413);
	}
	if (!supportedDurations.has(duration)) {
		return jsonError(
			"Выберите поддерживаемую длительность: 5 или 10 секунд.",
			400,
		);
	}
	if (!supportedAspectRatios.has(aspectRatio)) {
		return jsonError("Выберите формат кадра 16:9, 9:16 или 1:1.", 400);
	}
	if (model !== configuredModel) {
		return jsonError(
			"Выбранная модель не совпадает с настройкой сервера.",
			400,
		);
	}
	if (!/^[\w./-]+$/.test(imagePublicId) || imagePublicId.includes("..")) {
		return jsonError("Не удалось определить изображение для генерации.", 400);
	}

	const dimensions = {
		"16:9": { width: 1280, height: 720 },
		"9:16": { width: 720, height: 1280 },
		"1:1": { width: 720, height: 720 },
	}[aspectRatio];

	try {
		cloudinary.config({ cloud_name: cloudName, secure: true });
		const imageUrl = cloudinary.url(imagePublicId, {
			...dimensions,
			crop: "fill",
			gravity: "auto",
			fetch_format: "auto",
			quality: "auto",
			secure: true,
		});
		const [owner, modelName] = configuredModel.split("/");
		const predictionResponse = await fetch(
			`https://api.replicate.com/v1/models/${encodeURIComponent(owner)}/${encodeURIComponent(modelName)}/predictions`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
					Prefer: "wait=5",
					"Cancel-After": "10m",
				},
				body: JSON.stringify({
					input: {
						prompt,
						image: imageUrl,
						duration,
						aspect_ratio: aspectRatio,
						resolution: "720p",
					},
				}),
				signal: AbortSignal.timeout(30_000),
			},
		);
		const prediction = await readReplicateResponse(predictionResponse);
		if (!prediction?.id) {
			return jsonError("Replicate вернул некорректный ответ.", 502);
		}
		if (prediction.status === "failed" || prediction.status === "canceled") {
			return jsonError(
				prediction.error || "Replicate не смог создать видео.",
				502,
			);
		}

		return Response.json({
			id: prediction.id,
			model: configuredModel,
			status: prediction.status,
			videoUrl: getPredictionVideoUrl(prediction.output),
		});
	} catch (error) {
		return jsonError(
			error.message || "Не удалось запустить генерацию видео.",
			502,
		);
	}
}

export async function GET(request) {
	const token = process.env.REPLICATE_API_TOKEN;
	if (!token) {
		return jsonError(
			"Добавьте REPLICATE_API_TOKEN в переменные окружения Vercel.",
			503,
		);
	}

	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");
	if (!id || !/^[a-zA-Z0-9-]+$/.test(id)) {
		return jsonError("Укажите корректный идентификатор задачи.", 400);
	}

	try {
		const prediction = await getPrediction(token, id);
		const videoUrl = getPredictionVideoUrl(prediction.output);
		if (searchParams.get("download") === "1") {
			if (prediction.status !== "succeeded" || !videoUrl) {
				return jsonError("Готовое видео пока недоступно.", 409);
			}
			const output = new URL(videoUrl);
			if (
				output.hostname !== "replicate.delivery" &&
				!output.hostname.endsWith(".replicate.delivery")
			) {
				return jsonError("Нельзя скачать файл с этого адреса.", 502);
			}
			const downloadResponse = await fetch(output, {
				redirect: "error",
				signal: AbortSignal.timeout(120_000),
			});
			if (!downloadResponse.ok || !downloadResponse.body) {
				return jsonError("Не удалось скачать готовое видео.", 502);
			}
			return new Response(downloadResponse.body, {
				headers: {
					"Content-Type":
						downloadResponse.headers.get("content-type") || "video/mp4",
					"Content-Disposition": 'attachment; filename="generated-video.mp4"',
					"Cache-Control": "private, no-store",
				},
			});
		}

		return Response.json({
			id: prediction.id,
			status: prediction.status,
			videoUrl,
			error: prediction.error || null,
		});
	} catch (error) {
		return jsonError(
			error.message || "Не удалось получить статус генерации.",
			502,
		);
	}
}
