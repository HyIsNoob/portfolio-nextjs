import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { CursorProvider } from "@/components/ui/CursorContext";
import CustomCursor from "@/components/ui/CustomCursor";
import AudioPlayer from "@/components/ui/AudioPlayer";
import GrainOverlay from "@/components/ui/GrainOverlay";
import Preloader from "@/components/ui/Preloader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nguyen Khang Hy | Creative Developer",
  description: "Portfolio of Nguyen Khang Hy - CS Student, Video Editor & Creative Developer.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${oswald.variable} bg-background text-foreground antialiased selection:bg-white selection:text-black`}
      >
        <CursorProvider>
          <Preloader />
          <SmoothScroll>
            <GrainOverlay />
            <CustomCursor />
            <AudioPlayer />
            {children}
          </SmoothScroll>
        </CursorProvider>
      </body>
    </html>
  );
}
