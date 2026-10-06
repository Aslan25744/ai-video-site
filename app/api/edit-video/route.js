import { v2 as cloudinary } from "cloudinary";

const maxVideoSize = 50 * 1024 * 1024;
const allowedVideoTypes = new Set([
	"video/mp4",
	"video/quicktime",
	"video/webm",
]);
const cloudinaryFolder = "aijonai/video-edits";

export const runtime = "nodejs";
export const maxDuration = 300;

function getCloudinaryCredentials() {
	const value = process.env.CLOUDINARY_URL;
	if (!value) return null;

	try {
		const parsed = new URL(value);
		if (
			parsed.protocol !== "cloudinary:" ||
			!parsed.hostname ||
			!parsed.username ||
			!parsed.password
		) {
			return null;
		}

		return {
			cloudName: parsed.hostname,
			apiKey: decodeURIComponent(parsed.username),
			apiSecret: decodeURIComponent(parsed.password),
		};
	} catch {
		return null;
	}
}

function getReplicateConfig() {
	const token = process.env.REPLICATE_API_TOKEN;
	const model = process.env.REPLICATE_VIDEO_EDIT_MODEL;
	const modelParts = model?.match(/^([\w.-]+)\/([\w.-]+)$/);
	const videoField = process.env.REPLICATE_VIDEO_INPUT_FIELD || "video";
	const promptField = process.env.REPLICATE_PROMPT_INPUT_FIELD || "prompt";

	if (!token || !modelParts) return null;
	if (
		!/^[A-Za-z][A-Za-z0-9_]*$/.test(videoField) ||
		!/^[A-Za-z][A-Za-z0-9_]*$/.test(promptField) ||
		videoField === promptField
	) {
		return null;
	}

	return { token, owner: modelParts[1], modelName: modelParts[2], videoField, promptField };
}

function predictionOutputUrl(output) {
	const candidates = Array.isArray(output) ? output : [output];
	for (const candidate of candidates) {
		const value =
			typeof candidate === "string"
				? candidate
				: candidate && typeof candidate === "object"
					? candidate.url || candidate.video || candidate.output
					: null;
		if (typeof value !== "string") continue;
		try {
			const url = new URL(value);
			if (url.protocol === "https:") return url.toString();
		} catch {}
	}
	return null;
}

function jsonError(message, status) {
	return Response.json({ error: message }, { status });
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
	const replicate = getReplicateConfig();
	if (!replicate) {
		return jsonError(
			"Добавьте REPLICATE_API_TOKEN и REPLICATE_VIDEO_EDIT_MODEL=owner/model в .env.local. При необходимости задайте REPLICATE_VIDEO_INPUT_FIELD и REPLICATE_PROMPT_INPUT_FIELD по схеме модели.",
			503,
		);
	}

	const cloudinaryCredentials = getCloudinaryCredentials();
	if (!cloudinaryCredentials) {
		return jsonError("Добавьте CLOUDINARY_URL в .env.local для загрузки исходного видео.", 503);
	}

	const contentLength = Number(request.headers.get("content-length") || 0);
	if (contentLength > maxVideoSize + 128 * 1024) {
		return jsonError("Размер видео не должен превышать 50 МБ.", 413);
	}

	let formData;
	try {
		formData = await request.formData();
	} catch {
		return jsonError("Не удалось прочитать форму загрузки.", 400);
	}

	const file = formData.get("video");
	const prompt = formData.get("prompt");
	if (!(file instanceof File)) {
		return jsonError("Выберите исходное видео.", 400);
	}
	if (typeof prompt !== "string" || !prompt.trim()) {
		return jsonError("Добавьте описание нужного изменения.", 400);
	}
	if (prompt.length > 1000) {
		return jsonError("Описание не должно превышать 1000 символов.", 413);
	}
	if (!allowedVideoTypes.has(file.type)) {
		return jsonError("Поддерживаются видео MP4, MOV и WebM.", 415);
	}
	if (file.size > maxVideoSize) {
		return jsonError("Размер видео не должен превышать 50 МБ.", 413);
	}

	try {
		cloudinary.config({
			cloud_name: cloudinaryCredentials.cloudName,
			api_key: cloudinaryCredentials.apiKey,
			api_secret: cloudinaryCredentials.apiSecret,
			secure: true,
		});
		const fileBuffer = Buffer.from(await file.arrayBuffer());
		const hostedVideo = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder: cloudinaryFolder,
					resource_type: "video",
					timeout: 120_000,
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				},
			);
			uploadStream.end(fileBuffer);
		});

		const input = {
			[replicate.videoField]: hostedVideo.secure_url,
			[replicate.promptField]: prompt.trim(),
		};
		const predictionResponse = await fetch(
			`https://api.replicate.com/v1/models/${encodeURIComponent(replicate.owner)}/${encodeURIComponent(replicate.modelName)}/predictions`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${replicate.token}`,
					"Content-Type": "application/json",
					Prefer: "wait=5",
					"Cancel-After": "10m",
				},
				body: JSON.stringify({ input }),
				signal: AbortSignal.timeout(30_000),
			},
		);
		const prediction = await readReplicateResponse(predictionResponse);
		if (!prediction?.id) {
			return jsonError("Replicate вернул некорректный ответ.", 502);
		}
		if (prediction.status === "failed" || prediction.status === "canceled") {
			return jsonError(prediction.error || "Модель не смогла обработать видео.", 502);
		}

		return Response.json({
			id: prediction.id,
			status: prediction.status,
			videoUrl: predictionOutputUrl(prediction.output),
		});
	} catch (error) {
		return jsonError(error.message || "Не удалось отправить видео на обработку.", 502);
	}
}

export async function GET(request) {
	const replicate = getReplicateConfig();
	if (!replicate) {
		return jsonError("Добавьте REPLICATE_API_TOKEN и REPLICATE_VIDEO_EDIT_MODEL в .env.local.", 503);
	}

	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");
	if (!id || !/^[a-zA-Z0-9-]+$/.test(id)) {
		return jsonError("Укажите корректный идентификатор задачи.", 400);
	}

	try {
		const prediction = await getPrediction(replicate.token, id);
		const videoUrl = predictionOutputUrl(prediction.output);
		if (searchParams.get("download") === "1") {
			if (prediction.status !== "succeeded" || !videoUrl) {
				return jsonError("Обработанное видео пока недоступно.", 409);
			}
			const output = new URL(videoUrl);
			if (
				output.hostname !== "replicate.delivery" &&
				!output.hostname.endsWith(".replicate.delivery")
			) {
				return jsonError("Модель вернула ссылку, которую нельзя скачать через этот сервер.", 502);
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
					"Content-Type": downloadResponse.headers.get("content-type") || "video/mp4",
					"Content-Disposition": 'attachment; filename="edited-video.mp4"',
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
		return jsonError(error.message || "Не удалось получить статус задачи.", 502);
	}
}