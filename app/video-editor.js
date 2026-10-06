"use client";

import { useRef, useState } from "react";

const maxVideoSize = 50 * 1024 * 1024;
const allowedVideoTypes = new Set([
	"video/mp4",
	"video/quicktime",
	"video/webm",
]);

function wait(milliseconds) {
	return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export default function VideoEditor() {
	const fileInputRef = useRef(null);
	const [file, setFile] = useState(null);
	const [prompt, setPrompt] = useState("");
	const [status, setStatus] = useState("idle");
	const [predictionId, setPredictionId] = useState("");
	const [videoUrl, setVideoUrl] = useState("");
	const [error, setError] = useState("");
	const isBusy = status === "starting" || status === "processing";

	function handleFileChange(event) {
		const selectedFile = event.currentTarget.files?.[0];
		if (!selectedFile) return;

		if (!allowedVideoTypes.has(selectedFile.type)) {
			setError("Выберите видео в формате MP4, MOV или WebM.");
			setFile(null);
			event.currentTarget.value = "";
			return;
		}

		if (selectedFile.size > maxVideoSize) {
			setError("Размер видео не должен превышать 50 МБ.");
			setFile(null);
			event.currentTarget.value = "";
			return;
		}

		setError("");
		setVideoUrl("");
		setPredictionId("");
		setStatus("idle");
		setFile(selectedFile);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		if (!file || !prompt.trim()) return;

		setError("");	
		setVideoUrl("");
		setPredictionId("");
		setStatus("starting");

		try {
			const formData = new FormData();
			formData.set("video", file);
			formData.set("prompt", prompt.trim());

			const createResponse = await fetch("/api/edit-video", {
				method: "POST",
				body: formData,
			});
			const prediction = await createResponse.json();
			if (!createResponse.ok) {
				throw new Error(prediction.error || "Не удалось запустить обработку видео.");
			}

			setPredictionId(prediction.id);
			if (prediction.videoUrl) {
				setVideoUrl(prediction.videoUrl);
				setStatus("succeeded");
				return;
			}

			setStatus("processing");
			const timeoutAt = Date.now() + 10 * 60 * 1000;
			while (Date.now() < timeoutAt) {
				await wait(2500);
				const pollResponse = await fetch(
					`/api/edit-video?id=${encodeURIComponent(prediction.id)}`,
					{ cache: "no-store" },
				);
				const result = await pollResponse.json();
				if (!pollResponse.ok) {
					throw new Error(result.error || "Не удалось получить результат обработки.");
				}
				if (result.status === "failed" || result.status === "canceled") {
					throw new Error(result.error || "Модель не смогла обработать видео.");
				}
				if (result.videoUrl) {
					setVideoUrl(result.videoUrl);
					setStatus("succeeded");
					return;
				}
			}
			throw new Error("Обработка занимает дольше обычного. Проверьте статус модели позже.");
		} catch (caughtError) {
			setError(caughtError.message || "Произошла ошибка при обработке видео.");
			setStatus("failed");
		}
	}

	return (
		<section className="video-editor-section" aria-labelledby="video-editor-title">
			<div className="video-editor-heading">
				<div>
					<p className="gallery-kicker">РЕДАКТИРОВАНИЕ С ИИ</p>
					<h2 id="video-editor-title">Изменить или продолжить видео</h2>
					<p>Загрузите исходный ролик и опишите нужные изменения.</p>
				</div>
				<span className="editor-model-note">REPLICATE</span>
			</div>

			<div className="video-editor-grid">
				<form className="video-editor-form" onSubmit={handleSubmit}>
					<input
						ref={fileInputRef}
						className="visually-hidden"
						type="file"
						accept="video/mp4,video/quicktime,video/webm"
						aria-label="Выбрать исходное видео"
						onChange={handleFileChange}
					/>
					<div className="video-upload-box">
						<div className="video-upload-symbol" aria-hidden="true">↥</div>
						<strong>{file ? file.name : "Исходное видео"}</strong>
						<span>{file ? `${(file.size / (1024 * 1024)).toFixed(1)} МБ` : "MP4, MOV или WebM · до 50 МБ"}</span>
						<button
							className="video-upload-button"
							type="button"
							disabled={isBusy}
							onClick={() => fileInputRef.current?.click()}
						>
							{file ? "Заменить видео" : "Загрузить видео"}
						</button>
					</div>

					<label className="video-edit-prompt-label" htmlFor="video-edit-prompt">
						Что изменить или продолжить?
					</label>
					<textarea
						id="video-edit-prompt"
						className="video-edit-prompt"
						value={prompt}
						onChange={(event) => setPrompt(event.target.value)}
						maxLength={1000}
						rows={4}
						required
						placeholder="Например: добавь снег и холодный зимний свет…"
					/>
					<div className="video-prompt-examples">
						<button type="button" onClick={() => setPrompt("Добавь мягкий снегопад и холодный зимний свет.")}>Добавить снег</button>
						<button type="button" onClick={() => setPrompt("Замени объект в кадре на винтажный велосипед.")}>Заменить объект</button>
						<button type="button" onClick={() => setPrompt("Продолжи сцену ещё на 5 секунд, сохранив движение камеры и стиль.")}>Продлить сцену</button>
					</div>
					<button className="create-button video-edit-submit" type="submit" disabled={isBusy || !file}>
						{status === "starting" ? "Загружаем видео…" : status === "processing" ? "Обрабатываем видео…" : "Применить изменения"}
						{isBusy ? <span className="button-spinner" aria-hidden="true" /> : <span aria-hidden="true">↗</span>}
					</button>
					{predictionId ? <p className="prediction-id">Задача Replicate · {predictionId}</p> : null}
					{error ? <p className="upload-error" role="alert">{error}</p> : null}
					{isBusy ? <p className="replicate-status" role="status">{status === "starting" ? "Передаём видео модели…" : "Модель редактирует видео. Это может занять несколько минут."}</p> : null}
				</form>

				<div className="video-result-panel">
					<div className="video-result-heading">
						<div>
							<span className="panel-kicker">РЕЗУЛЬТАТ</span>
							<h3>{videoUrl ? "Готовое видео" : "Предпросмотр результата"}</h3>
						</div>
						<span className={`render-status ${isBusy ? "is-rendering" : ""}`}><i /> {status === "succeeded" ? "Готово" : isBusy ? "В работе" : "Ожидает"}</span>
					</div>
					{videoUrl ? (
						<>
							<video className="edited-video-player" src={videoUrl} controls playsInline preload="metadata" />
							<a className="video-download-button" href={`/api/edit-video?id=${encodeURIComponent(predictionId)}&download=1`}>
								<span aria-hidden="true">↓</span> Скачать видео
							</a>
						</>
					) : (
						<div className="video-result-empty">
							<span aria-hidden="true">▶</span>
							<p>Обработанное видео появится здесь</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
