"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("页面错误:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 text-center">
      <span className="text-6xl mb-4">⚡</span>
      <h1 className="text-xl font-bold text-gray-700 mb-2">出了点状况</h1>
      <p className="text-gray-400 text-sm mb-6">
        卦盘被打乱了，试试重新来过
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary">
          🔄 重新加载
        </button>
      </div>
    </div>
  );
}
