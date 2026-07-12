"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { HEXAGRAMS } from "@/data/hexagrams";
import type { HexagramData } from "@/types";

/** 所有卦象的扁平数组 */
const ALL_HEXAGRAMS: HexagramData[] = Object.values(HEXAGRAMS).sort(
  (a, b) => a.id - b.id
);

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");

  // 搜索过滤
  const results = useMemo(() => {
    if (!keyword.trim()) return ALL_HEXAGRAMS.slice(0, 20); // 默认展示前20个

    const kw = keyword.trim().toLowerCase();
    return ALL_HEXAGRAMS.filter((h) => {
      return (
        h.name.includes(kw) ||
        h.id.toString() === kw ||
        h.description.includes(kw) ||
        h.upperTrigram.includes(kw) ||
        h.lowerTrigram.includes(kw) ||
        h.symbol === kw
      );
    });
  }, [keyword]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 顶部搜索栏 */}
      <header className="px-5 pt-6 pb-3 sticky top-0 bg-[#f8f7ff] z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-primary-500 transition-colors shrink-0"
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
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索卦名、卦辞..."
              className="input-primary pl-9"
              autoFocus
            />
          </div>
        </div>
      </header>

      {/* 结果列表 */}
      <div className="px-5 pb-8">
        {results.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl">🔍</span>
            <p className="text-gray-400 mt-3">没有找到相关卦象</p>
            <p className="text-gray-300 text-sm mt-1">
              试试输入「乾」「坤」或卦名部分文字
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">
              {keyword.trim()
                ? `找到 ${results.length} 个卦象`
                : "浏览全部 64 卦"}
            </p>
            <div className="space-y-2">
              {results.map((hex) => (
                <Link
                  key={hex.id}
                  href={`/hexagram/${hex.id}`}
                  className="card-hover flex items-center gap-4 py-3 px-4"
                >
                  <span className="text-3xl shrink-0">{hex.symbol}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">
                        {hex.name}卦
                      </span>
                      <span className="text-xs text-gray-300">#{hex.id}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {hex.description.slice(0, 30)}
                    </p>
                  </div>
                  <span className="text-xs text-gray-300 shrink-0">
                    {hex.upperTrigram}上{hex.lowerTrigram}下
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
