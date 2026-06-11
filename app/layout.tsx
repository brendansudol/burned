import type { Metadata, Viewport } from "next";
import { Anton, Courier_Prime, Archivo } from "next/font/google";
import "./globals.css";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const script = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-script",
});

const ui = Archivo({
  subsets: ["latin"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "BURNED — the roast machine",
  description: "Name a thing. Watch it go up.",
};

export const viewport: Viewport = {
  themeColor: "#15100c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${script.variable} ${ui.variable}`}>
        {children}
      </body>
    </html>
  );
}
