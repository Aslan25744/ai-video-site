import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 dark:bg-black">
			<div className="text-center">
				<h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
					Страница не найдена
				</h1>
				<p className="mt-3 text-zinc-600 dark:text-zinc-400">
					Похоже, такой страницы не существует или она была перемещена.
				</p>
				<Link
					href="/"
					className="mt-6 inline-flex font-medium text-black underline underline-offset-4 dark:text-white"
				>
					Вернуться на главную
				</Link>
			</div>
		</main>
	);
}