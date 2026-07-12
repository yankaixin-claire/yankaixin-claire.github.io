import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "周易运势 — AI 占卜解惑",
  description: "每日宜忌、卦象占卜、AI 运势解读，用千年智慧解答你的人生困惑",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#a855f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[#f8f7ff] text-gray-900 antialiased">
        <div className="mx-auto max-w-lg min-h-screen relative">
          {children}
        </div>
        <PwaRegister />
      </body>
    </html>
  );
}
