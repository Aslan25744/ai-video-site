"use client";

import { useRef, useState } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

const durations = [5, 10];
const aspectRatios = ["16:9", "9:16", "1:1"];
const modelId = "bytedance/seedance-1-lite";
const samplePrompts = [
	{
		label: "Ночной Токио",
		prompt:
			"Кинематографичный пролёт над ночным Токио после дождя: неон отражается в мокром асфальте, камера плавно скользит между улицами, мягкий туман.",
	},
	{
		label: "Горный рассвет",
		prompt:
			"Широкий план горного озера на рассвете, первые лучи солнца касаются вершин, лёгкая дымка над водой, медленное движение камеры.",
	},
	{
		label: "Предметная съёмка",
		prompt:
			"Премиальная предметная съёмка флакона духов на тёмном камне, тонкий луч света, капли воды, медленный поворот камеры.",
	},
];

const cloudinary = new Cloudinary({ cloud: { cloudName: "qcj3kseg" } });

export default function HeroGenerator() {
	const fileInputRef = useRef(null);
	const [prompt, setPrompt] = useState("");
	const [duration, setDuration] = useState(5);
	const [aspectRatio, setAspectRatio] = useState("16:9");
	const [model, setModel] = useState(modelId);
	const [generation, setGeneration] = useState(null);
	const [previewPlaying, setPreviewPlaying] = useState(false);
	const [referenceImage, setReferenceImage] = useState(null);
	const [uploadingImage, setUploadingImage] = useState(false);
	const [uploadError, setUploadError] = useState("");
	const [videoError, setVideoError] = useState("");
	const isGenerating =
		generation?.status === "starting" || generation?.status === "processing";
	const previewWidth =
		aspectRatio === "9:16" ? 720 : aspectRatio === "1:1" ? 1000 : 1600;
	const previewHeight =
		aspectRatio === "9:16" ? 1280 : aspectRatio === "1:1" ? 1000 : 900;
	const previewAsset = cloudinary
		.image(referenceImage?.publicId || "cld-sample-5")
		.format("auto")
		.quality("auto")
		.resize(
			auto().gravity(autoGravity()).width(previewWidth).height(previewHeight),
		);

	async function handleSubmit(event) {
		event.preventDefault();
		if (isGenerating || !prompt.trim()) return;

		const generationInput = {
			prompt: prompt.trim(),
			duration,
			aspectRatio,
			model,
			imagePublicId: referenceImage?.publicId || "cld-sample-5",
		};
		setVideoError("");
		setGeneration({ ...generationInput, status: "starting" });

		try {
			const createResponse = await fetch("/api/generate-video", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(generationInput),
			});
			const prediction = await createResponse.json();
			if (!createResponse.ok) {
				throw new Error(
					prediction.error || "Не удалось запустить генерацию видео.",
				);
			}
			if (prediction.status === "failed" || prediction.status === "canceled") {
				throw new Error(prediction.error || "Replicate не смог создать видео.");
			}
			if (prediction.videoUrl) {
				setGeneration({
					...generationInput,
					...prediction,
					status: "succeeded",
				});
				return;
			}
			if (!prediction.id) {
				throw new Error("Replicate не вернул идентификатор задачи.");
			}

			setGeneration({
				...generationInput,
				...prediction,
				status: "processing",
			});
			const timeoutAt = Date.now() + 10 * 60 * 1000;
			while (Date.now() < timeoutAt) {
				await new Promise((resolve) => window.setTimeout(resolve, 2500));
				const pollResponse = await fetch(
					`/api/generate-video?id=${encodeURIComponent(prediction.id)}`,
					{ cache: "no-store" },
				);
				const result = await pollResponse.json();
				if (!pollResponse.ok) {
					throw new Error(
						result.error || "Не удалось получить статус генерации.",
					);
				}
				if (result.status === "failed" || result.status === "canceled") {
					throw new Error(result.error || "Replicate не смог создать видео.");
				}
				if (result.videoUrl) {
					setGeneration({ ...generationInput, ...result, status: "succeeded" });
					return;
				}
				if (result.status === "succeeded") {
					throw new Error("Модель завершилась без ссылки на видео.");
				}
				setGeneration((current) => ({
					...current,
					...result,
					status: "processing",
				}));
			}
			throw new Error(
				"Генерация занимает дольше обычного. Попробуйте проверить результат позже.",
			);
		} catch (error) {
			setVideoError(error.message || "Не удалось создать видео.");
			setGeneration((current) =>
				current ? { ...current, status: "failed" } : current,
			);
		}
	}

	async function handleReferenceUpload(event) {
		const input = event.currentTarget;
		const file = input.files?.[0];
		if (!file) return;

		if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(file.type)) {
			setUploadError("Выберите изображение JPG, PNG или WebP.");
			input.value = "";
			return;
		}

		if (file.size > 10 * 1024 * 1024) {
			setUploadError("Размер файла не должен превышать 10 МБ.");
			input.value = "";
			return;
		}

		setUploadError("");
		setUploadingImage(true);
		const formData = new FormData();
		formData.set("file", file);

		try {
			const response = await fetch("/api/cloudinary/upload", {
				method: "POST",
				body: formData,
			});
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Не удалось загрузить изображение.");
			}

			setReferenceImage({
				name: file.name,
				publicId: result.publicId,
				secureUrl: result.secureUrl,
				optimizedUrl: result.optimizedUrl,
			});
		} catch (error) {
			setUploadError(error.message || "Не удалось загрузить изображение.");
		} finally {
			setUploadingImage(false);
			input.value = "";
		}
	}

	return (
		<section className="generator-workspace" aria-label="Создание видео">
			<form className="generator-form" id="create" onSubmit={handleSubmit}>
				<div className="form-heading">
					<div>
						<span className="panel-kicker">ШАГ 01 · СЦЕНА</span>
						<h2>Опишите видео</h2>
					</div>
					<span className="text-video-tag">
						ТЕКСТ <b>→</b> ВИДЕО
					</span>
				</div>

				<label className="field-label" htmlFor="video-prompt">
					Ваш запрос
				</label>
				<div className="prompt-field">
					<textarea
						id="video-prompt"
						required
						maxLength={500}
						rows={6}
						value={prompt}
						onChange={(event) => setPrompt(event.target.value)}
						placeholder="Опишите сцену, движение камеры, свет и настроение…"
					/>
					<div className="prompt-field-footer">
						<span className="prompt-helper">
							<span>✦</span> Чем точнее описание, тем выразительнее кадр
						</span>
						<span className="character-count">{prompt.length} / 500</span>
					</div>
				</div>

				<div className="reference-upload-row">
					<input
						ref={fileInputRef}
						className="visually-hidden"
						type="file"
						accept="image/jpeg,image/png,image/webp"
						aria-label="Выбрать изображение-референс"
						onChange={handleReferenceUpload}
					/>
					{referenceImage ? (
						<div className="reference-file-chip">
							<span
								className="reference-thumb"
								role="img"
								aria-label="Предпросмотр референса"
								style={{
									backgroundImage: `url("${referenceImage.optimizedUrl}")`,
								}}
							/>
							<span className="reference-file-name" title={referenceImage.name}>
								{referenceImage.name}
							</span>
							<span className="reference-uploaded">Загружено</span>
							<button
								className="reference-remove"
								type="button"
								aria-label="Удалить изображение-референс"
								onClick={() => setReferenceImage(null)}
							>
								×
							</button>
						</div>
					) : (
						<button
							className="reference-upload-button"
							type="button"
							disabled={uploadingImage}
							onClick={() => fileInputRef.current?.click()}
						>
							<span aria-hidden="true">↥</span>
							{uploadingImage ? "Загружаем референс…" : "Добавить изображение"}
						</button>
					)}
					<span className="reference-file-note">JPG, PNG, WebP · до 10 МБ</span>
				</div>
				{uploadError ? (
					<p className="upload-error" role="alert">
						{uploadError}
					</p>
				) : null}

				<div className="prompt-ideas" aria-label="Примеры запросов">
					<span>Идеи</span>
					{samplePrompts.map((idea) => (
						<button
							key={idea.label}
							type="button"
							onClick={() => setPrompt(idea.prompt)}
						>
							{idea.label}
						</button>
					))}
				</div>

				<div className="form-divider" />

				<div className="model-row">
					<label className="select-field">
						<span className="field-label">Модель</span>
						<select
							value={model}
							onChange={(event) => setModel(event.target.value)}
						>
							<option value={modelId}>Seedance 1.0 Lite</option>
						</select>
					</label>
					<div className="quality-field">
						<span className="field-label">Качество</span>
						<span className="quality-value">
							<i /> Высокое
						</span>
					</div>
				</div>

				<div className="output-controls">
					<fieldset className="choice-field">
						<legend className="field-label">Формат кадра</legend>
						<div className="choice-row">
							{aspectRatios.map((ratio) => (
								<button
									key={ratio}
									type="button"
									aria-pressed={aspectRatio === ratio}
									onClick={() => setAspectRatio(ratio)}
									className={`choice-button ${aspectRatio === ratio ? "is-selected" : ""}`}
								>
									<span
										className={`ratio-icon ratio-${ratio.replace(":", "-")}`}
									/>
									{ratio}
								</button>
							))}
						</div>
					</fieldset>
					<fieldset className="choice-field">
						<legend className="field-label">Длительность</legend>
						<div className="choice-row">
							{durations.map((seconds) => (
								<button
									key={seconds}
									type="button"
									aria-pressed={duration === seconds}
									onClick={() => setDuration(seconds)}
									className={`choice-button ${duration === seconds ? "is-selected" : ""}`}
								>
									{seconds} сек
								</button>
							))}
						</div>
					</fieldset>
				</div>

				<button className="create-button" type="submit" disabled={isGenerating}>
					{isGenerating ? (
						<>
							<span className="button-spinner" />
							{generation?.status === "starting"
								? "Запускаем генерацию…"
								: "Создаём видео…"}
						</>
					) : (
						<>
							Создать видео <span aria-hidden="true">↗</span>
						</>
					)}
				</button>
				<p className="demo-disclaimer">
					Seedance 1.0 Lite · генерация через Replicate
				</p>
				{videoError ? (
					<p className="upload-error" role="alert">
						{videoError}
					</p>
				) : null}
			</form>

			<section className="preview-panel" aria-label="Предпросмотр видео">
				<div className="preview-heading">
					<div>
						<span className="panel-kicker">РЕЗУЛЬТАТ</span>
						<h2>Предпросмотр</h2>
					</div>
					<span
						className={`render-status ${isGenerating ? "is-rendering" : ""}`}
					>
						<i />{" "}
						{isGenerating
							? "В работе"
							: generation?.status === "succeeded"
								? "Готово"
								: generation?.status === "failed"
									? "Ошибка"
									: "Ожидает запроса"}
					</span>
				</div>

				<div
					className={`preview-stage ${aspectRatio === "9:16" ? "is-portrait" : aspectRatio === "1:1" ? "is-square" : ""} ${previewPlaying ? "is-playing" : ""}`}
					style={{
						backgroundImage: "none",
					}}
				>
					{generation?.videoUrl ? (
						<video
							className="preview-video"
							src={generation.videoUrl}
							controls
							playsInline
							preload="metadata"
							aria-label="Сгенерированное видео"
						/>
					) : (
						<AdvancedImage
							cldImg={previewAsset}
							alt={
								referenceImage
									? `Референс: ${referenceImage.name}`
									: "Демонстрационный кадр Cloudinary"
							}
							className="preview-cloudinary-image"
						/>
					)}
					<div className="preview-image-shade" />
					<div className="preview-stage-top">
						<span className="scene-counter">
							КАДР 01 <i>/</i> 04
						</span>
						<span className="preview-quality">
							UHD <i /> 24 FPS
						</span>
					</div>
					<button
						className="preview-play"
						type="button"
						aria-label={
							previewPlaying
								? "Приостановить предпросмотр"
								: "Воспроизвести предпросмотр"
						}
						onClick={() => setPreviewPlaying((playing) => !playing)}
					>
						{previewPlaying ? "Ⅱ" : "▶"}
					</button>
					<div className="preview-stage-bottom">
						<span>
							{previewPlaying
								? "ВОСПРОИЗВЕДЕНИЕ"
								: referenceImage
									? "РЕФЕРЕНС-КАДР"
									: "КОНЦЕПТ-КАДР"}
						</span>
						<span>
							{duration.toString().padStart(2, "0")} СЕК · {aspectRatio}
						</span>
					</div>
				</div>

				<div className="preview-caption">
					<div>
						<span className="panel-kicker">ТЕКУЩИЙ КОНЦЕПТ</span>
						<strong>
							{generation?.videoUrl
								? "Новое видео"
								: generation?.prompt
									? "Новая сцена"
									: "Город после дождя"}
						</strong>
					</div>
					<span className="caption-model">{model}</span>
				</div>
				{generation?.videoUrl ? (
					<a
						className="video-download-button"
						href={`/api/generate-video?id=${encodeURIComponent(generation.id)}&download=1`}
					>
						<span aria-hidden="true">↓</span> Скачать видео
					</a>
				) : null}
			</section>
		</section>
	);
}
