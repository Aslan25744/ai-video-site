import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "AiJonAi Studio — Генератор видео с ИИ",
	description:
		"Создавайте выразительные видеоконцепты с помощью ИИ в творческой студии AiJonAi.",
};

export default function RootLayout({ children }) {
	return (
		<html
			lang="ru"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full bg-[#070b14] text-white">{children}</body>
		</html>
	);
}
