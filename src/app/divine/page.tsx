"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { DivinationResult } from "@/types";
import { saveEntry } from "@/lib/storage";
import { shareResult } from "@/lib/share";

/** 六爻展示组件 */
function HexagramLines({
  lines,
  changingLines,
  label,
}: {
  lines: Array<{ isYang: boolean; isChanging: boolean; position: number }>;
  changingLines: number[];
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs text-gray-400 mb-1">{label}</span>
      {/* 从上到下：第6爻在上 */}
      {[...lines].reverse().map((line) => {
        const isChanging = changingLines.includes(line.position);
        return (
          <div key={line.position} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-300 w-3 text-right">
              {line.position}
            </span>
            {line.isYang ? (
              // 阳爻：一整条线
              <div
                className={`h-2 w-16 rounded-full transition-all duration-500 ${
                  isChanging
                    ? "bg-primary-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                    : "bg-gray-700"
                }`}
              />
            ) : (
              // 阴爻：两段短线
              <div className="flex gap-3">
                <div
                  className={`h-2 w-6 rounded-full transition-all duration-500 ${
                    isChanging
                      ? "bg-primary-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      : "bg-gray-700"
                  }`}
                />
                <div
                  className={`h-2 w-6 rounded-full transition-all duration-500 ${
                    isChanging
                      ? "bg-primary-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      : "bg-gray-700"
                  }`}
                />
              </div>
            )}
            {isChanging && (
              <span className="text-xs text-primary-500 font-bold">⚡</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** AI 打字机效果 */
function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;

    const interval = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-0.5 h-4 bg-primary-500 animate-pulse ml-0.5 align-middle" />
      )}
    </div>
  );
}

function DivineContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const question = searchParams.get("q") || "今日运势";

  const [result, setResult] = useState<DivinationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<"casting" | "revealing" | "interpreting" | "complete">(
    "casting"
  );
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  // 分享
  const handleShare = async () => {
    if (!result) return;
    const { success, method } = await shareResult(result);
    if (success && method === "clipboard") {
      setShareMsg("已复制到剪贴板 📋");
    } else if (success && method === "share") {
      setShareMsg("分享成功 ✅");
    }
    setTimeout(() => setShareMsg(null), 2500);
  };

  useEffect(() => {
    let cancelled = false;

    async function doDivine() {
      try {
        // 模拟起卦动画
        await new Promise((r) => setTimeout(r, 1500));
        if (cancelled) return;
        setStage("revealing");

        // 调用 API
        const res = await fetch("/api/divine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });

        const data = await res.json();
        if (cancelled) return;

        if (!data.success) {
          setError(data.error?.message || "占卜失败");
          return;
        }

        setResult(data.data);
        setStage("interpreting");

        // 打字机效果时间（按文字长度估算）
        const textLen = data.data.interpretation.length;
        await new Promise((r) => setTimeout(r, Math.min(textLen * 30, 5000)));
        if (cancelled) return;

        setStage("complete");

        // 保存历史
        try {
          saveEntry({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            question,
            hexagramName: data.data.castResult.primaryHexagram.name,
            hexagramId: data.data.castResult.primaryHexagram.id,
            summary: data.data.interpretation.slice(0, 100),
            timestamp: data.data.timestamp,
          });
        } catch {
          // ignore
        }
      } catch {
        if (!cancelled) setError("网络错误，请检查网络后重试");
      }
    }

    doDivine();
    return () => { cancelled = true; };
  }, [question]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 顶部导航 */}
      <header className="px-5 pt-6 pb-3 flex items-center gap-3">
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
        <div className="flex-1">
          <h1 className="text-base font-bold text-gray-800">占卜结果</h1>
          <p className="text-xs text-gray-400 truncate">{question}</p>
        </div>
      </header>

      <div className="flex-1 px-5 pb-8">
        {/* 错误状态 */}
        {error && (
          <div className="text-center py-16">
            <span className="text-4xl">😵</span>
            <p className="text-gray-500 mt-3">{error}</p>
            <button onClick={() => router.push("/")} className="btn-primary mt-4">
              返回首页
            </button>
          </div>
        )}

        {/* 起卦动画 */}
        {stage === "casting" && !error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <span className="text-6xl animate-bounce">🪙</span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse delay-75" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse delay-150" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-6 animate-pulse-soft">
              正在起卦中...
            </p>
          </div>
        )}

        {/* 结果内容 */}
        {result && stage !== "casting" && (
          <div className="animate-fade-in space-y-5">
            {/* 卦象展示 */}
            <div className="card flex items-center justify-center gap-8 py-6">
              <HexagramLines
                lines={result.castResult.lines.map((l) => ({
                  isYang: l.isYang,
                  isChanging: l.isChanging,
                  position: l.position,
                }))}
                changingLines={result.castResult.changingLines}
                label="本卦"
              />

              <div className="text-center">
                <span className="text-5xl">
                  {result.castResult.primaryHexagram.symbol}
                </span>
                <p className="text-lg font-bold text-primary-700 mt-1">
                  {result.castResult.primaryHexagram.name}卦
                </p>
                {result.castResult.transformedHexagram && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-3xl">
                      {result.castResult.transformedHexagram.symbol}
                    </span>
                    <p className="text-sm font-medium text-primary-500 mt-0.5">
                      → {result.castResult.transformedHexagram.name}卦
                    </p>
                  </div>
                )}
              </div>

              {result.castResult.transformedHexagram && (
                <HexagramLines
                  lines={
                    // 变卦的六爻：翻转动爻
                    result.castResult.lines.map((l) => {
                      if (l.isChanging) {
                        return {
                          isYang: !l.isYang,
                          isChanging: false,
                          position: l.position,
                        };
                      }
                      return {
                        isYang: l.isYang,
                        isChanging: false,
                        position: l.position,
                      };
                    })
                  }
                  changingLines={[]}
                  label="变卦"
                />
              )}
            </div>

            {/* 动爻标签 */}
            {result.castResult.changingLines.length > 0 && (
              <div className="flex items-center gap-2 justify-center">
                <span className="text-xs text-gray-400">动爻：</span>
                {result.castResult.changingLines.map((pos) => (
                  <span
                    key={pos}
                    className="chip text-xs"
                  >
                    第{pos}爻 ⚡
                  </span>
                ))}
              </div>
            )}

            {/* AI 解读 */}
            <div className="card">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">
                🤖 AI 运势解读
              </h3>
              {stage === "revealing" ? (
                <div className="space-y-2">
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-5/6" />
                  <div className="skeleton h-3 w-4/6" />
                </div>
              ) : (
                <TypewriterText text={result.interpretation} />
              )}
            </div>

            {/* 操作按钮 */}
            {stage === "complete" && (
              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 rounded-btn border border-primary-200 text-sm text-primary-600
                             hover:bg-primary-50 transition-colors font-medium"
                >
                  📤 分享结果
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="flex-1 btn-primary text-sm"
                >
                  🔄 再问一次
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast 提示 */}
      {shareMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50
                        bg-gray-800 text-white text-sm px-5 py-2.5 rounded-full
                        shadow-lg animate-slide-up">
          {shareMsg}
        </div>
      )}
    </div>
  );
}

/** 用 Suspense 包裹（useSearchParams 需要） */
export default function DivinePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-400">加载中...</p>
        </div>
      }
    >
      <DivineContent />
    </Suspense>
  );
}
