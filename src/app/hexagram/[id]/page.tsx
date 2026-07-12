"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { HEXAGRAMS } from "@/data/hexagrams";
import { notFound } from "next/navigation";

export default function HexagramDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const hexagram = HEXAGRAMS[id];

  if (!hexagram || id < 1 || id > 64) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 顶部 */}
      <header className="px-5 pt-6 pb-3 flex items-center gap-3">
        <Link
          href="/search"
          className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-primary-500 transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-bold text-gray-800">
          #{hexagram.id} {hexagram.name}卦
        </h1>
      </header>

      <div className="flex-1 px-5 pb-8 space-y-4 animate-fade-in">
        {/* 卦象符号 */}
        <div className="card text-center py-6">
          <span className="text-6xl">{hexagram.symbol}</span>
          <h2 className="text-2xl font-bold text-primary-700 mt-2">
            {hexagram.name}卦
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {hexagram.upperTrigram}上{hexagram.lowerTrigram}下
          </p>
        </div>

        {/* 卦辞 */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">📜 卦辞</h3>
          <p className="text-gray-700 leading-relaxed">
            {hexagram.description}
          </p>
        </div>

        {/* 彖传 */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">📖 彖传</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {hexagram.judgment}
          </p>
        </div>

        {/* 象传 */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">🏔 象传</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {hexagram.image}
          </p>
        </div>

        {/* 六爻爻辞 */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            ⚡ 六爻爻辞
          </h3>
          <div className="space-y-3">
            {hexagram.lines.map((text, i) => {
              const position = i + 1;
              const labels = [
                "初爻",
                "二爻",
                "三爻",
                "四爻",
                "五爻",
                "上爻",
              ];
              return (
                <div
                  key={position}
                  className="flex gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="text-xs font-medium text-primary-500 shrink-0 w-10 pt-0.5">
                    {labels[i]}
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 返回搜索 */}
        <Link
          href="/search"
          className="block text-center py-3 text-sm text-primary-500 hover:text-primary-600 transition-colors"
        >
          ← 返回卦象列表
        </Link>
      </div>
    </div>
  );
}
