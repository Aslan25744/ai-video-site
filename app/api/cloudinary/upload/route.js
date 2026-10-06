import { v2 as cloudinary } from "cloudinary";

const maxFileSize = 10 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const uploadFolder = "aijonai/references";

export const runtime = "nodejs";

function getCloudinaryCredentials() {
	const cloudinaryUrl = process.env.CLOUDINARY_URL;
	if (!cloudinaryUrl) return null;

	try {
		const parsedUrl = new URL(cloudinaryUrl);
		if (
			parsedUrl.protocol !== "cloudinary:" ||
			!parsedUrl.hostname ||
			!parsedUrl.username ||
			!parsedUrl.password
		) {
			return null;
		}

		return {
			cloudName: parsedUrl.hostname,
			apiKey: decodeURIComponent(parsedUrl.username),
			apiSecret: decodeURIComponent(parsedUrl.password),
		};
	} catch {
		return null;
	}
}

export async function POST(request) {
	const credentials = getCloudinaryCredentials();

	if (!credentials) {
		return Response.json(
			{
				error: "Cloudinary не настроен. Добавьте CLOUDINARY_URL в .env.local.",
			},
			{ status: 503 },
		);
	}
	const { cloudName, apiKey, apiSecret } = credentials;

	const contentLength = Number(request.headers.get("content-length") || 0);
	if (contentLength > maxFileSize + 128 * 1024) {
		return Response.json(
			{ error: "Размер файла не должен превышать 10 МБ." },
			{ status: 413 },
		);
	}

	let file;
	try {
		file = (await request.formData()).get("file");
	} catch {
		return Response.json(
			{ error: "Не удалось прочитать файл." },
			{ status: 400 },
		);
	}

	if (!(file instanceof File)) {
		return Response.json(
			{ error: "Выберите изображение для загрузки." },
			{ status: 400 },
		);
	}

	if (!allowedTypes.has(file.type)) {
		return Response.json(
			{ error: "Поддерживаются изображения JPG, PNG и WebP." },
			{ status: 415 },
		);
	}

	if (file.size > maxFileSize) {
		return Response.json(
			{ error: "Размер файла не должен превышать 10 МБ." },
			{ status: 413 },
		);
	}

	try {
		cloudinary.config({
			cloud_name: cloudName,
			api_key: apiKey,
			api_secret: apiSecret,
			secure: true,
		});
		const fileData = Buffer.from(await file.arrayBuffer()).toString("base64");
		const uploadResult = await cloudinary.uploader.upload(
			`data:${file.type};base64,${fileData}`,
			{ folder: uploadFolder, resource_type: "image", timeout: 30_000 },
		);
		const optimizedUrl = cloudinary.url(uploadResult.public_id, {
			fetch_format: "auto",
			quality: "auto",
			secure: true,
		});
		const squareUrl = cloudinary.url(uploadResult.public_id, {
			crop: "auto",
			gravity: "auto",
			width: 500,
			height: 500,
			fetch_format: "auto",
			quality: "auto",
			secure: true,
		});

		return Response.json({
			publicId: uploadResult.public_id,
			secureUrl: uploadResult.secure_url,
			optimizedUrl,
			squareUrl,
			width: uploadResult.width,
			height: uploadResult.height,
		});
	} catch (error) {
		return Response.json(
			{
				error:
					error?.message ||
					"Cloudinary не смог обработать изображение. Проверьте настройки аккаунта.",
			},
			{ status: 502 },
		);
	}
}
