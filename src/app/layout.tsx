import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Le Village Mysterieux",
  description: "Jeu familial de secrets, roles et accusations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
