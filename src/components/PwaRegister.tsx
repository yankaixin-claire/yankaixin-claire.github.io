"use client";

import { useEffect } from "react";

/**
 * PWA Service Worker 注册
 * 仅在客户端执行
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("📦 SW registered:", reg.scope);
      })
      .catch((err) => {
        console.log("📦 SW skipped:", err.message);
      });
  }, []);

  return null;
}
