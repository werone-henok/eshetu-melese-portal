import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppSettingsProvider } from "@/context/AppSettingsContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Eshetu Melese Member Portal & CMS",
  description: "Official digital membership verification and portal for the Eshetu Melese global community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark h-full antialiased ${outfit.variable} ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-[#0B0F19] text-slate-100 dark:bg-[#0B0F19] dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 selection:bg-amber-500/30 selection:text-amber-200"
        suppressHydrationWarning
      >
        <AppSettingsProvider>
          {children}
        </AppSettingsProvider>
      </body>
    </html>
  );
}
