import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Painel 3D · Hélix — Digital Twin AI",
  description: "Plataforma B2B de Gêmeos Digitais e Telemetria IoT para o setor de hospitalidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
