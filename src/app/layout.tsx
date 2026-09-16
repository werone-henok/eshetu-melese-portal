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
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-[#0B0F19] text-slate-100 dark:bg-[#0B0F19] dark:text-slate-100 flex flex-col font-sans transition-colors duration-200" suppressHydrationWarning>
        <AppSettingsProvider>
          {children}
        </AppSettingsProvider>
      </body>
    </html>
  );
}
