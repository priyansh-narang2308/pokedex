import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/header";
import { CompareDock } from "@/components/pokemon/compare-dock";
import { ToastProvider } from "@/components/toast-provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Pokédex",
  description: "Pokédex - Explore and compare Pokémon",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              <Header />

              <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
              </main>

              <CompareDock />
            </ToastProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
