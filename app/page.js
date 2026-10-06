import HeroGenerator from "./hero-generator";
import StudioWorkspace from "./studio-workspace";
import VideoShowcase from "./video-showcase";

const stats = [
	{ value: "10x", label: "faster edits" },
	{ value: "4.9/5", label: "creator rating" },
	{ value: "32k+", label: "videos generated" },
	{ value: "3 min", label: "average render" },
];

const features = [
	{
		icon: "⚡",
		title: "Prompt-to-video",
		text: "Type a concept and generate cinematic scenes with motion, camera angles, and transitions built in.",
	},
	{
		icon: "🎭",
		title: "Consistent characters",
		text: "Keep your hero subject, voice, and style stable across every shot for brand-safe storytelling.",
	},
	{
		icon: "🧠",
		title: "Smart editing",
		text: "Trim, extend, and remix scenes with AI-assisted script changes that preserve pacing and narrative flow.",
	},
	{
		icon: "📦",
		title: "Brand kit sync",
		text: "Apply your colors, fonts, logos, and campaign look across all generated video variations automatically.",
	},
];

const steps = [
	{
		number: "01",
		title: "Describe the scene",
		text: "Write your idea, script, or storyboard prompt.",
	},
	{
		number: "02",
		title: "Choose your style",
		text: "Pick cinematic, product, social, or documentary direction.",
	},
	{
		number: "03",
		title: "Generate and refine",
		text: "Preview multiple versions and use AI edits for reshoots.",
	},
	{
		number: "04",
		title: "Publish instantly",
		text: "Export in vertical, square, or widescreen formats.",
	},
];

const plans = [
	{
		name: "Starter",
		price: "$19",
		description: "For freelancers and early experiments.",
		features: ["200 video credits", "HD exports", "Basic brand kit"],
		featured: false,
	},
	{
		name: "Studio",
		price: "$59",
		description: "For teams shipping weekly campaigns.",
		features: [
			"Unlimited storyboards",
			"Character consistency",
			"Priority rendering",
		],
		featured: true,
	},
	{
		name: "Scale",
		price: "$149",
		description: "For agencies and content producers.",
		features: ["API access", "Team workspaces", "Custom model controls"],
		featured: false,
	},
];

export function LegacyMarketingHome() {
	return (
		<div className="min-h-screen bg-[#070b14] text-white">
			<header className="mx-auto max-w-7xl px-6 pt-6 sm:px-8 lg:px-10">
				<div className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-lg font-bold text-slate-950">
							A
						</div>
						<div className="flex items-center gap-2">
							<p className="text-sm font-semibold tracking-[0.22em] text-violet-200 uppercase">
								AiJonAi
							</p>
							<span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-violet-100">
								Imagine
							</span>
						</div>
					</div>

					<nav className="hidden items-center gap-8 text-sm text-slate-200 md:flex">
						<a href="#features" className="transition hover:text-white">
							Features
						</a>
						<a href="#workflow" className="transition hover:text-white">
							Workflow
						</a>
						<a href="#pricing" className="transition hover:text-white">
							Pricing
						</a>
						<a href="#reviews" className="transition hover:text-white">
							Reviews
						</a>
					</nav>

					<div className="flex items-center gap-3">
						<button
							type="button"
							className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:text-white sm:inline-flex"
						>
							Log in
						</button>
						<button
							type="button"
							className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-violet-200"
						>
							Get started to use
						</button>
					</div>
				</div>
			</header>

			<main>
				<section className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-24 lg:pt-20">
					<div className="flex flex-col justify-center">
						<div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-100">
							<span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
							New: AI cinematic video studio
						</div>

						<h1 className="max-w-xl text-5xl font-black tracking-tight text-white sm:text-6xl">
							Turn a prompt into a full-fidelity video story.
						</h1>

						<p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
							Create ad creatives, product reels, explainers, and social videos
							with AI that understands your brand, voice, and visual style.
						</p>

						<HeroGenerator />

						<div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
							{stats.map((stat) => (
								<div
									key={stat.label}
									className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
								>
									<p className="text-2xl font-bold text-white">{stat.value}</p>
									<p className="mt-1 text-sm text-slate-300">{stat.label}</p>
								</div>
							))}
						</div>
					</div>

					<div className="relative flex items-center justify-center">
						<div className="absolute inset-6 rounded-full bg-violet-500/20 blur-3xl" />
						<div className="relative w-full max-w-xl rounded-[32px] border border-white/10 bg-slate-950/80 p-4 shadow-[0_30px_120px_rgba(11,16,28,0.9)] backdrop-blur-xl">
							<div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-violet-950 p-5">
								<div className="mb-5 flex items-center justify-between">
									<div>
										<p className="text-xs uppercase tracking-[0.22em] text-slate-400">
											Prompt → video
										</p>
										<p className="mt-1 text-lg font-semibold text-white">
											Launch teaser
										</p>
									</div>
									<div className="rounded-full border border-violet-400/30 bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-200">
										AI video preview
									</div>
								</div>

								<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
									<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
										Prompt
									</p>
									<p className="mt-3 text-sm leading-6 text-slate-200">
										“A cinematic launch film for a sustainable electric scooter:
										dawn city commute, close-up product motion, premium
										lifestyle shots, voiceover-driven storytelling.”
									</p>
								</div>

								<div className="my-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-cyan-200/80">
									<span className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-300/40 to-cyan-300/50" />
									Prompt transformed into moving scenes
									<span className="h-px flex-1 bg-gradient-to-r from-cyan-300/50 via-violet-300/40 to-transparent" />
								</div>

								<div className="mt-5 grid gap-3 sm:grid-cols-3">
									{[
										{
											label: "Shot 01",
											color: "from-violet-500/80 to-cyan-400/80",
										},
										{
											label: "Shot 02",
											color: "from-pink-500/80 to-orange-400/80",
										},
										{
											label: "Shot 03",
											color: "from-emerald-500/80 to-cyan-500/80",
										},
									].map((shot) => (
										<div
											key={shot.label}
											className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900"
										>
											<div className={`h-28 bg-gradient-to-br ${shot.color}`} />
											<div className="flex items-center justify-between px-3 py-2 text-xs text-slate-300">
												<span>{shot.label}</span>
												<span className="text-emerald-300">✓</span>
											</div>
										</div>
									))}
								</div>

								<div className="mt-5 rounded-2xl border border-violet-400/30 bg-violet-500/10 p-4">
									<div className="flex items-center justify-between text-sm">
										<span className="text-violet-100">Generation timeline</span>
										<span className="text-violet-200">92%</span>
									</div>
									<div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
										<div className="h-full w-[92%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<VideoShowcase />

				<section
					id="features"
					className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-20"
				>
					<div className="mb-10 max-w-2xl">
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
							Why teams switch
						</p>
						<h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
							Built for rapid creative iteration.
						</h2>
					</div>

					<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
						{features.map((feature) => (
							<article
								key={feature.title}
								className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
							>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 text-2xl">
									{feature.icon}
								</div>
								<h3 className="text-xl font-semibold text-white">
									{feature.title}
								</h3>
								<p className="mt-3 text-sm leading-7 text-slate-300">
									{feature.text}
								</p>
							</article>
						))}
					</div>
				</section>

				<section
					id="workflow"
					className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-20"
				>
					<div className="mb-10 text-center">
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
							Workflow
						</p>
						<h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
							From concept to publish in four steps.
						</h2>
					</div>

					<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
						{steps.map((step) => (
							<div
								key={step.number}
								className="rounded-3xl border border-white/10 bg-slate-950/60 p-6"
							>
								<div className="mb-5 flex items-center justify-between">
									<span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
										{step.number}
									</span>
									<span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
								</div>
								<h3 className="text-xl font-semibold text-white">
									{step.title}
								</h3>
								<p className="mt-3 text-sm leading-7 text-slate-300">
									{step.text}
								</p>
							</div>
						))}
					</div>
				</section>

				<section
					id="pricing"
					className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-20"
				>
					<div className="mb-10 text-center">
						<p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
							Pricing
						</p>
						<h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
							Flexible plans for creators and teams.
						</h2>
					</div>

					<div className="grid gap-6 lg:grid-cols-3">
						{plans.map((plan) => (
							<div
								key={plan.name}
								className={`rounded-3xl border p-7 ${
									plan.featured
										? "border-violet-400/50 bg-gradient-to-b from-violet-500/15 to-slate-950 p-7 shadow-[0_25px_80px_rgba(109,76,255,0.35)]"
										: "border-white/10 bg-white/5"
								}`}
							>
								<div className="flex items-center justify-between">
									<h3 className="text-xl font-semibold text-white">
										{plan.name}
									</h3>
									{plan.featured ? (
										<span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-100">
											Popular
										</span>
									) : null}
								</div>
								<div className="mt-6 flex items-end gap-2">
									<span className="text-4xl font-black text-white">
										{plan.price}
									</span>
									<span className="pb-1 text-sm text-slate-300">/ month</span>
								</div>
								<p className="mt-3 text-sm leading-6 text-slate-300">
									{plan.description}
								</p>
								<ul className="mt-6 space-y-3 text-sm text-slate-200">
									{plan.features.map((feature) => (
										<li key={feature} className="flex items-center gap-3">
											<span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-xs text-emerald-300">
												✓
											</span>
											{feature}
										</li>
									))}
								</ul>
								<button
									type="button"
									className={`mt-8 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${
										plan.featured
											? "bg-white text-slate-950 hover:bg-violet-100"
											: "border border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
									}`}
								>
									{plan.featured ? "Get started" : "Choose plan"}
								</button>
							</div>
						))}
					</div>
				</section>

				<section
					id="reviews"
					className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-20"
				>
					<div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-violet-500/10 via-slate-950 to-cyan-500/10 p-8 lg:p-12">
						<div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
							<div>
								<p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
									Created for creators
								</p>
								<h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
									Make the video you imagined.
								</h2>
							</div>

							<div className="space-y-6">
								<blockquote className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 text-lg leading-8 text-slate-200">
									“Every great video starts with an idea. AiJonAi helps bring
									that idea to life, one prompt at a time.”
								</blockquote>
								<div className="flex items-center gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 font-bold text-slate-950">
										AI
									</div>
									<div>
										<p className="font-semibold text-white">
											Created by Aslan Imanbayev
										</p>
										<p className="text-sm text-slate-400">AiJonAi creator</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 border-t border-white/10 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:px-8 lg:px-10">
				<p>© 2026 AIJONAI — Created by Aslan Imanbayev</p>
				<div className="flex items-center gap-6">
					<a href="#features" className="transition hover:text-white">
						Features
					</a>
					<a href="#pricing" className="transition hover:text-white">
						Pricing
					</a>
					<a href="#reviews" className="transition hover:text-white">
						Reviews
					</a>
				</div>
			</footer>
		</div>
	);
}

export default function Home() {
	return <StudioWorkspace />;
}
