const videos = [
	{
		title: "Город после дождя",
		category: "Кино · город",
		duration: "00:12",
		scene: "city",
	},
	{
		title: "Золотой разгон",
		category: "Автомобиль · реклама",
		duration: "00:08",
		scene: "car",
	},
	{
		title: "Новая форма",
		category: "Мода · портрет",
		duration: "00:15",
		scene: "fashion",
	},
	{
		title: "Завтра в движении",
		category: "Технологии · CGI",
		duration: "00:10",
		scene: "technology",
	},
	{
		title: "Выше облаков",
		category: "Природа · горы",
		duration: "00:14",
		scene: "mountains",
	},
	{
		title: "Форма № 01",
		category: "Предметная съёмка",
		duration: "00:09",
		scene: "product",
	},
];

const windowPositions = [
	[14, 16],
	[42, 16],
	[14, 47],
	[42, 47],
	[14, 78],
];

function VideoArtwork({ scene, title }) {
	const gradientId = `artwork-${scene}`;

	return (
		<svg
			viewBox="0 0 800 450"
			preserveAspectRatio="xMidYMid slice"
			role="img"
			aria-label={`${title} — концепт видео с ИИ`}
			className="gallery-art"
		>
			<defs>
				<linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
					<stop
						offset="0%"
						stopColor={scene === "product" ? "#d99052" : "#422d83"}
					/>
					<stop
						offset="48%"
						stopColor={scene === "mountains" ? "#648ba5" : "#192342"}
					/>
					<stop
						offset="100%"
						stopColor={scene === "car" ? "#d36c46" : "#08101e"}
					/>
				</linearGradient>
				<radialGradient id={`${gradientId}-glow`}>
					<stop offset="0%" stopColor="#ffffff" stopOpacity=".9" />
					<stop offset="35%" stopColor="#8ddcff" stopOpacity=".45" />
					<stop offset="100%" stopColor="#8ddcff" stopOpacity="0" />
				</radialGradient>
				<linearGradient id={`${gradientId}-bottom`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#05070d" stopOpacity="0" />
					<stop offset="100%" stopColor="#05070d" />
				</linearGradient>
			</defs>
			<rect width="800" height="450" fill={`url(#${gradientId})`} />
			<circle cx="580" cy="110" r="145" fill={`url(#${gradientId}-glow)`} />
			{scene === "city" ? (
				<>
					<circle cx="580" cy="110" r="46" fill="#ffd4bc" opacity=".8" />
					<path
						d="M0 305 115 270 220 300 340 245 465 295 570 250 800 290V450H0Z"
						fill="#11182b"
					/>
					{[
						[38, 165, 78, 155],
						[132, 115, 84, 205],
						[232, 190, 72, 130],
						[330, 95, 92, 225],
						[445, 155, 76, 165],
						[665, 175, 90, 145],
						[756, 120, 72, 200],
					].map(([x, y, width, height]) => (
						<g key={`${x}-${y}`}>
							<rect
								x={x}
								y={y}
								width={width}
								height={height}
								rx="4"
								fill="#10172a"
							/>
							{windowPositions.map(([windowX, windowY]) => (
								<rect
									key={`${windowX}-${windowY}`}
									x={x + windowX}
									y={y + windowY}
									width="7"
									height="11"
									rx="2"
									fill={(windowX + windowY) % 2 ? "#55d5eb" : "#f4ad7c"}
									opacity=".75"
								/>
							))}
						</g>
					))}
					<path d="M270 450 380 320H455L560 450Z" fill="#202741" />
					<path
						d="M414 365h12l-4 24h-12zm-12 45h15l-5 28h-17z"
						fill="#e8b98d"
						opacity=".8"
					/>
				</>
			) : null}
			{scene === "car" ? (
				<>
					<circle cx="594" cy="122" r="69" fill="#ffc38c" opacity=".82" />
					<path d="M0 322Q210 280 800 326V450H0Z" fill="#171824" />
					<path
						d="m155 305 58-67q16-18 44-22l186-13q35-2 61 23l66 66 61 20q24 8 29 37l-5 27H143l-3-26q1-32 15-45Z"
						fill="#d8b58f"
					/>
					<path
						d="m249 256 35-40q11-11 29-13l127-9q22-1 40 14l49 49Z"
						fill="#253046"
					/>
					<path
						d="M143 331q247-28 517 0"
						fill="none"
						stroke="#fff0d2"
						strokeOpacity=".7"
						strokeWidth="3"
					/>
					<circle cx="253" cy="379" r="43" fill="#090d17" />
					<circle cx="253" cy="379" r="24" fill="#b3c2cd" />
					<circle cx="253" cy="379" r="9" fill="#202b3e" />
					<circle cx="574" cy="379" r="43" fill="#090d17" />
					<circle cx="574" cy="379" r="24" fill="#b3c2cd" />
					<circle cx="574" cy="379" r="9" fill="#202b3e" />
					<path d="M650 323h38q17 0 25 14l7 13h-65z" fill="#ffc780" />
				</>
			) : null}
			{scene === "fashion" ? (
				<>
					<path d="M0 0h800v450H0Z" fill="#191322" opacity=".38" />
					<path d="M310 0h180L620 450H180Z" fill="#f1c38e" opacity=".1" />
					<path d="M0 365 800 300v150H0Z" fill="#0a0d18" />
					<path d="M320 450 400 315 480 450Z" fill="#f0c48e" opacity=".18" />
					<circle cx="407" cy="118" r="29" fill="#d6a994" />
					<path
						d="M382 114q5-49 51-37 22 7 21 33l-14-13-43 7-5 21Z"
						fill="#201822"
					/>
					<path
						d="m384 153-28 18-37 62 31 17 34-42-12 56 61 12 19-67 30 43 30-17-43-67-28-16Z"
						fill="#302239"
					/>
					<path
						d="m372 239-40 27-35 121q93 36 207-1l-40-120-30-30-10 67h-37Z"
						fill="#b38181"
					/>
					<path
						d="M340 388q66 23 155-1"
						fill="none"
						stroke="#efc99f"
						strokeWidth="3"
						opacity=".7"
					/>
					<path
						d="m382 254-11 127m69-120 12 118"
						stroke="#f2d5b2"
						strokeOpacity=".24"
						strokeWidth="3"
					/>
				</>
			) : null}
			{scene === "technology" ? (
				<>
					<path d="M0 0h800v450H0Z" fill="#071624" opacity=".5" />
					<g fill="none" stroke="#71e1f1" strokeOpacity=".38">
						<circle cx="410" cy="222" r="155" strokeWidth="2" />
						<circle cx="410" cy="222" r="116" strokeWidth="1" />
						<path
							d="M78 335 236 263 312 282M488 143l106-57 132 62M500 297l102 79 120-17M210 143l99 47"
							strokeWidth="2"
						/>
					</g>
					<path
						d="m410 105 102 59v116l-102 59-102-59V164Z"
						fill="#1a4860"
						stroke="#a4f3ff"
						strokeWidth="3"
					/>
					<path
						d="m410 105 0 117 102 58V164Zm0 117-102-58v116l102 59Z"
						fill="#123249"
					/>
					<circle cx="410" cy="222" r="34" fill="#b8f8ff" opacity=".9" />
					<circle cx="410" cy="222" r="19" fill="#fff" />
					{[
						[236, 263],
						[594, 86],
						[602, 376],
						[210, 143],
						[726, 179],
					].map(([cx, cy]) => (
						<circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="#b3f6ff" />
					))}
				</>
			) : null}
			{scene === "mountains" ? (
				<>
					<circle cx="550" cy="135" r="55" fill="#ffdfa8" opacity=".9" />
					<path
						d="m0 335 178-192 83 91 92-135 195 238 81-110 171 132v91H0Z"
						fill="#354b69"
					/>
					<path
						d="m260 234 93-135 95 116-48-25-42 16-26-24Z"
						fill="#d3dce5"
						opacity=".9"
					/>
					<path
						d="m0 350 176-146 119 119 126-125 157 157 105-96 117 102v89H0Z"
						fill="#263c54"
					/>
					<path d="m70 450 180-150 108 93 118-136 215 193Z" fill="#172d40" />
					<path
						d="M0 359q166 42 332 9t468-6"
						fill="none"
						stroke="#d9eaff"
						strokeOpacity=".4"
						strokeWidth="3"
					/>
					<g fill="#0d1c29">
						<path d="m84 352 18-54 18 54h-10l14 30H80l14-30Zm617-21 13-41 14 41h-8l10 24h-34l11-24Z" />
					</g>
				</>
			) : null}
			{scene === "product" ? (
				<>
					<path d="M0 355q180-74 400-10t400-8v113H0Z" fill="#1b1820" />
					<ellipse
						cx="410"
						cy="372"
						rx="170"
						ry="33"
						fill="#e2ac75"
						opacity=".32"
					/>
					<path d="M350 165h120v-45h-120z" fill="#d5b185" />
					<path d="M371 120V82h78v38" fill="#c39a70" />
					<rect
						x="321"
						y="164"
						width="180"
						height="190"
						rx="32"
						fill="#b77d5d"
						stroke="#f0cda2"
						strokeWidth="3"
					/>
					<path
						d="M339 184h144v132q0 20-20 20h-104q-20 0-20-20Z"
						fill="#e6bb91"
						opacity=".28"
					/>
					<path
						d="M353 207h116"
						stroke="#f5d5ae"
						strokeOpacity=".65"
						strokeWidth="2"
					/>
					<rect x="363" y="243" width="96" height="58" rx="4" fill="#eed2a9" />
					<path
						d="M386 262h50m-50 12h38"
						stroke="#674a40"
						strokeOpacity=".8"
						strokeWidth="3"
					/>
					<path
						d="m274 0 174 0-96 164h-58Zm378 0H510l72 164h66Z"
						fill="#f3c48b"
						opacity=".08"
					/>
				</>
			) : null}
			<rect
				y="330"
				width="800"
				height="120"
				fill={`url(#${gradientId}-bottom)`}
				opacity=".22"
			/>
		</svg>
	);
}

export default function VideoShowcase() {
	return (
		<section className="gallery-section" id="gallery">
			<div className="gallery-header">
				<div>
					<p className="gallery-kicker">БИБЛИОТЕКА КАДРОВ</p>
					<h2 className="gallery-heading">Идеи для следующего видео</h2>
					<p className="gallery-description">
						Шесть визуальных направлений для нового проекта.
					</p>
				</div>
				<a className="gallery-create-link" href="#create">
					Создать своё <span aria-hidden="true">↗</span>
				</a>
			</div>

			<div className="gallery-grid">
				{videos.map((video) => (
					<article key={video.scene} className="gallery-card">
						<div className="gallery-frame">
							<VideoArtwork scene={video.scene} title={video.title} />
							<div className="gallery-frame-shade" />
							<span className="gallery-badge">
								<span aria-hidden="true">✦</span> КОНЦЕПТ С ИИ
							</span>
							<span className="gallery-duration">{video.duration}</span>
							<span className="gallery-play" aria-hidden="true">
								▶
							</span>
							<span className="gallery-category">{video.category}</span>
						</div>
						<div className="gallery-card-info">
							<div>
								<h3>{video.title}</h3>
								<p>
									AiJonAi <span>·</span> пример кадра
								</p>
							</div>
							<span className="gallery-arrow" aria-hidden="true">
								↗
							</span>
						</div>
					</article>
				))}
			</div>
			<p className="gallery-note">
				Иллюстративные концепты · это кадры-примеры, а не готовые видеоролики
			</p>
		</section>
	);
}
