import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WazaHub",
  description: "Trilha de evolução no judô: Domine suas técnicas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased font-sans text-black bg-white">
        <header className="border-b-4 border-black p-6 sticky top-0 bg-white z-50">
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            Waza<span className="text-red-600 border-b-4 border-red-600">Hub</span>
          </h1>
        </header>
        <main className="max-w-2xl mx-auto w-full min-h-screen border-x-2 border-black bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
