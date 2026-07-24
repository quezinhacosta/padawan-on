import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Usando Inter que é mais leve e combina com nosso design
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Padawan ON - Sistema de Gestão",
  description: "Plataforma de gestão do programa de extensão Padawan - UNICAP",
  keywords: "Padawan, UNICAP, extensão, gestão, orientadores, mentores, calouros",
  authors: [{ name: "Padawan ON Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}