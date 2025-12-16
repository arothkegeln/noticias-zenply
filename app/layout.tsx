import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar"; // Kept but unused?
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Noticias Zenply",
  description: "Track your news efficiently",
};

import { ConfigProvider } from '@/components/config-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground" style={{ fontFamily: inter.style.fontFamily }} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConfigProvider>
            {children}
          </ConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
