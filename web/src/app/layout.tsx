import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "e-Bujo",
  description: "Bullet Journal digital com Supabase e TipTap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}

