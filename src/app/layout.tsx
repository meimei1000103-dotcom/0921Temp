import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "台灣氣象 GIS 資訊地圖 | Taiwan Weather GIS Application",
  description:
    "即時呈現台灣22縣市氣象預報、自動氣象站觀測資料與 GIS 空間視覺化互動地圖，串接交通部中央氣象署 (CWA) 開放資料平台。",
  keywords: [
    "台灣氣象",
    "中央氣象署",
    "CWA",
    "GIS",
    "氣象地圖",
    "天氣預報",
    "Next.js",
    "Leaflet",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
