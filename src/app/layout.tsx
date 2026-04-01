import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Header } from "@/components/Header";

const font = Inter({ subsets: ["latin"], weight: ["400", "700", "900"] });

export const viewport: Viewport = {
  themeColor: "#000000"
};

export const metadata: Metadata = {
  title: "WazaHub",
  description: "Acompanhamento do caminho suave - Seu progresso no Judô",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "WazaHub"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${font.className} antialiased min-h-screen bg-white text-black`}>
        <AuthProvider>
          <div className="max-w-2xl mx-auto w-full min-h-screen border-x-2 border-black bg-white shadow-xl flex flex-col relative">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
