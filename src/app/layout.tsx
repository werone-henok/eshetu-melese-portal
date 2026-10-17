import type { Metadata } from "next";
import "./globals.css";
import { AppSettingsProvider } from "@/context/AppSettingsContext";

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
      className="dark h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
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
