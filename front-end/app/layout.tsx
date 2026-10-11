import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SGA",
  description: "Plataforma de gestão do programa de extensão - Ciência da Computação UNICAP",
  keywords: "Padawan, UNICAP, extensão, mentoria, apadrinhamento, calouros, ciência da computação",
  authors: [{ name: "Padawan ON Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}