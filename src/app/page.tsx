"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { DailyFortune } from "@/types";

/** 热门问题快捷入口 */
const HOT_QUESTIONS = [
  { icon: "💰", text: "近期财运如何？" },
  { icon: "💼", text: "事业发展方向？" },
  { icon: "❤️", text: "感情运势怎样？" },
  { icon: "🏥", text: "健康状况如何？" },
  { icon: "📚", text: "学业考试运？" },
  { icon: "🤝", text: "人际关系运势？" },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [daily, setDaily] = useState<DailyFortune | null>(null);
  const [loading, setLoading] = useState(true);

  // 加载每日运势
  useEffect(() => {
    fetch("/api/daily")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDaily(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 发起占卜
  const handleDivine = useCallback(
    (question: string) => {
      const q = question.trim();
      if (!q) return;
      router.push(`/divine?q=${encodeURIComponent(q)}`);
    },
    [router]
  );

  return (
    <div className="flex flex-col min-h-screen pb-8">
      {/* ===== 顶部导航 ===== */}
      <header className="px-5 pt-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">☯️</span>
          <h1 className="text-xl font-bold text-primary-700">周易运势</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/history"
            className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-primary-500 transition-colors"
            title="占卜记录"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </Link>
          <Link
            href="/search"
            className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-primary-500 transition-colors"
            title="搜索卦象"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </Link>
        </div>
      </header>

      {/* ===== 每日运势卡片 ===== */}
      <section className="px-5 mb-6 animate-fade-in">
        {loading ? (
          <div className="card space-y-3">
            <div className="skeleton h-5 w-24" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
            <div className="flex gap-2">
              <div className="skeleton h-8 w-16 rounded-full" />
              <div className="skeleton h-8 w-16 rounded-full" />
              <div className="skeleton h-8 w-16 rounded-full" />
            </div>
          </div>
        ) : daily ? (
          <div className="card border-l-4 border-primary-400">
            {/* 日期 + 卦象 */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400">
                  {daily.date.replace(/-/g, ".")}
                </p>
                <h2 className="text-lg font-bold text-gray-800">
                  今日运势
                </h2>
              </div>
              <div className="text-right">
                <span className="text-3xl">{daily.hexagram.symbol}</span>
                <p className="text-xs text-primary-500 font-medium">
                  {daily.hexagram.name}卦
                </p>
              </div>
            </div>

            {/* 概述 */}
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {daily.summary}
            </p>

            {/* 宜 / 忌 */}
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <p className="text-xs text-teal-600 font-medium mb-1.5">✅ 宜</p>
                <div className="flex flex-wrap gap-1.5">
                  {daily.yi.map((item, i) => (
                    <span key={i} className="chip-green text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-rose-600 font-medium mb-1.5">⚠️ 忌</p>
                <div className="flex flex-wrap gap-1.5">
                  {daily.ji.map((item, i) => (
                    <span key={i} className="chip-red text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 幸运颜色 + 数字 */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">🎨 幸运色</span>
                <span
                  className="w-5 h-5 rounded-full shadow-sm"
                  style={{ backgroundColor: daily.luckyColor.hex }}
                />
                <span className="text-xs text-gray-600">
                  {daily.luckyColor.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">🔢 幸运数字</span>
                <span className="text-sm font-bold text-primary-600">
                  {daily.luckyNumber}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* ===== 问答区 ===== */}
      <section className="px-5 mb-6 animate-slide-up">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">
          💬 有问题想问问运势？
        </h3>

        {/* 输入框 */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDivine(query)}
            placeholder='输入你的问题...比如"我该跳槽吗"'
            className="input-primary flex-1"
            maxLength={200}
          />
          <button
            onClick={() => handleDivine(query)}
            disabled={query.trim().length < 2}
            className="btn-primary shrink-0"
          >
            🔮 占卜
          </button>
        </div>

        {/* 热门问题 */}
        <div className="flex flex-wrap gap-2">
          {HOT_QUESTIONS.map((q) => (
            <button
              key={q.text}
              onClick={() => handleDivine(q.text)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                         bg-white border border-gray-150 text-xs text-gray-600
                         hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50
                         transition-all duration-200 shadow-sm"
            >
              <span className="text-sm">{q.icon}</span>
              {q.text}
            </button>
          ))}
        </div>
      </section>

      {/* ===== 快捷入口 ===== */}
      <section className="px-5 mt-auto animate-slide-up">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/search"
            className="card-hover flex items-center gap-3 py-4"
          >
            <span className="text-2xl">📖</span>
            <div>
              <p className="text-sm font-medium text-gray-800">卦象查询</p>
              <p className="text-xs text-gray-400">搜索 64 卦详解</p>
            </div>
          </Link>
          <Link
            href="/divine?q=今日运势"
            className="card-hover flex items-center gap-3 py-4"
          >
            <span className="text-2xl">🎲</span>
            <div>
              <p className="text-sm font-medium text-gray-800">随机占卜</p>
              <p className="text-xs text-gray-400">不问问题，随机起卦</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 底部说明 */}
      <p className="text-center text-xs text-gray-300 mt-8 px-5">
        基于易经六十四卦 · AI 智能解读 · 仅供娱乐参考
      </p>
    </div>
  );
}
