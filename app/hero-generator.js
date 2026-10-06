"use client";

import { useEffect, useRef, useState } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

const durations = [5, 10, 15];
const aspectRatios = ["16:9", "9:16", "1:1"];
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
	const [model, setModel] = useState("Кинематографичная");
	const [generation, setGeneration] = useState(null);
	const [previewPlaying, setPreviewPlaying] = useState(false);
	const [referenceImage, setReferenceImage] = useState(null);
	const [uploadingImage, setUploadingImage] = useState(false);
	const [uploadError, setUploadError] = useState("");
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

	useEffect(() => {
		if (generation?.status !== "generating") return;

		const timeout = window.setTimeout(() => {
			setGeneration((current) =>
				current?.status === "generating"
					? { ...current, status: "complete" }
					: current,
			);
		}, 1600);

		return () => window.clearTimeout(timeout);
	}, [generation?.status]);

	function handleSubmit(event) {
		event.preventDefault();
		setGeneration({
			prompt: prompt.trim(),
			duration,
			aspectRatio,
			model,
			referenceImage: referenceImage?.secureUrl || null,
			status: "generating",
		});
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
							<option>Кинематографичная</option>
							<option>Естественное движение</option>
							<option>Предметная съёмка</option>
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

				<button
					className="create-button"
					type="submit"
					disabled={generation?.status === "generating"}
				>
					{generation?.status === "generating" ? (
						<>
							<span className="button-spinner" /> Создаём видео…
						</>
					) : (
						<>
							Создать видео <span aria-hidden="true">↗</span>
						</>
					)}
				</button>
				<p className="demo-disclaimer">
					Демо-режим · API-рендеринг пока не подключён
				</p>
			</form>

			<section className="preview-panel" aria-label="Предпросмотр видео">
				<div className="preview-heading">
					<div>
						<span className="panel-kicker">РЕЗУЛЬТАТ</span>
						<h2>Предпросмотр</h2>
					</div>
					<span
						className={`render-status ${generation?.status === "generating" ? "is-rendering" : ""}`}
					>
						<i />{" "}
						{generation?.status === "generating"
							? "В работе"
							: generation?.status === "complete"
								? "Демо готово"
								: "Ожидает запроса"}
					</span>
				</div>

				<div
					className={`preview-stage ${aspectRatio === "9:16" ? "is-portrait" : aspectRatio === "1:1" ? "is-square" : ""} ${previewPlaying ? "is-playing" : ""}`}
					style={{
						backgroundImage: "none",
					}}
				>
					<AdvancedImage
						cldImg={previewAsset}
						alt={
							referenceImage
								? `Референс: ${referenceImage.name}`
								: "Демонстрационный кадр Cloudinary"
						}
						className="preview-cloudinary-image"
					/>
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
							{generation?.prompt ? "Новая сцена" : "Город после дождя"}
						</strong>
					</div>
					<span className="caption-model">{model}</span>
				</div>
				{generation?.status === "complete" ? (
					<p className="render-disclaimer" aria-live="polite">
						Это демонстрационный кадр. Для генерации видео подключите API
						рендеринга.
					</p>
				) : null}
			</section>
		</section>
	);
}
