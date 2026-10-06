import HeroGenerator from "./hero-generator";
import VideoEditor from "./video-editor";
import VideoShowcase from "./video-showcase";

export default function StudioWorkspace() {
	return (
		<div className="studio-app">
			<aside className="studio-sidebar">
				<a className="studio-brand" href="#create" aria-label="AiJonAi Studio">
					<span className="brand-mark">Ai</span>
					<span className="brand-wordmark">
						AiJonAi <span>STUDIO</span>
					</span>
				</a>

				<div className="sidebar-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
				<nav className="sidebar-nav" aria-label="Основная навигация">
					<a
						className="sidebar-link is-current"
						href="#create"
						aria-current="page"
					>
						<span className="sidebar-icon" aria-hidden="true">
							✦
						</span>
						<span>Создать видео</span>
					</a>
					<a className="sidebar-link" href="#gallery">
						<span className="sidebar-icon" aria-hidden="true">
							▧
						</span>
						<span>Библиотека</span>
					</a>
					<a className="sidebar-link" href="#gallery">
						<span className="sidebar-icon" aria-hidden="true">
							⌘
						</span>
						<span>Шаблоны</span>
					</a>
				</nav>

				<div className="sidebar-spacer" />

				<section className="credit-panel" aria-label="Баланс кредитов">
					<div className="credit-panel-top">
						<span>ПЛАН STUDIO</span>
						<span className="credit-status">АКТИВЕН</span>
					</div>
					<p className="credit-count">
						124 <span>/ 200 кредитов</span>
					</p>
					<div className="credit-track">
						<span />
					</div>
					<a href="#create" className="credit-link">
						Управление планом <span>↗</span>
					</a>
				</section>

				<div className="profile-row">
					<div className="profile-avatar" aria-hidden="true">
						АИ
					</div>
					<div className="profile-copy">
						<strong>Аслан Иманбаев</strong>
						<span>Личный аккаунт</span>
					</div>
					<span className="profile-menu" aria-hidden="true">
						···
					</span>
				</div>
			</aside>

			<div className="studio-main">
				<header className="studio-topbar">
					<div className="topbar-crumbs">
						<span>Творческая студия</span>
						<span className="crumb-divider">/</span>
						<strong>Новый проект</strong>
					</div>
					<div className="topbar-actions">
						<span className="system-status">
							<i /> Все системы работают
						</span>
						<span className="topbar-separator" />
						<span className="topbar-credits">
							<b>✦</b> 124
						</span>
						<div className="topbar-avatar" aria-label="Аслан Иманбаев">
							АИ
						</div>
					</div>
				</header>

				<main className="studio-content">
					<section className="studio-intro">
						<div>
							<div className="studio-eyebrow">
								<span /> AI VIDEO GENERATOR
							</div>
							<h1>
								Генератор видео <span>с ИИ</span>
							</h1>
							<p>Задайте направление. Мы поможем превратить его в кадр.</p>
						</div>
						<div className="session-chip">
							<span>●</span> Новая сессия
						</div>
					</section>

					<HeroGenerator />
					<VideoEditor />
					<VideoShowcase />

					<footer className="studio-footer">
						<span>© 2026 AiJonAi Studio</span>
						<span>Создано Асланом Иманбаевым</span>
					</footer>
				</main>
			</div>
		</div>
	);
}
