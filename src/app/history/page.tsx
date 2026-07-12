"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getHistory, clearHistory } from "@/lib/storage";
import type { HistoryEntry } from "@/types";

/** 格式化时间 */
function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;

  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(getHistory());
    setLoaded(true);
  }, []);

  const handleClear = () => {
    if (window.confirm("确认清空所有占卜记录？")) {
      clearHistory();
      setEntries([]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 顶部 */}
      <header className="px-5 pt-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
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
          <h1 className="text-base font-bold text-gray-800">占卜记录</h1>
        </div>
        {entries.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-rose-500 transition-colors"
          >
            清空
          </button>
        )}
      </header>

      {/* 内容 */}
      <div className="flex-1 px-5 pb-8">
        {!loaded ? (
          // 加载态
          <div className="space-y-3 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card space-y-2">
                <div className="skeleton h-4 w-20" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          // 空状态
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">🔮</span>
            <h2 className="text-base font-medium text-gray-500 mb-1">
              还没有占卜记录
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              去首页问一个问题，开始你的第一次占卜吧
            </p>
            <Link href="/" className="btn-primary text-sm">
              去占卜
            </Link>
          </div>
        ) : (
          // 列表
          <div className="space-y-2 pt-2 animate-fade-in">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/divine?q=${encodeURIComponent(entry.question)}`}
                className="card-hover flex items-start gap-3 py-3 px-4"
              >
                <span className="text-2xl shrink-0 mt-0.5">🔮</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {entry.question}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {entry.summary}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="chip text-[10px]">
                      {entry.hexagramName}卦
                    </span>
                    <span className="text-[10px] text-gray-300">
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>
                </div>
                <svg
                  className="shrink-0 text-gray-300 mt-1"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
