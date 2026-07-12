/**
 * localStorage 历史记录管理
 */

import type { HistoryEntry } from "@/types";

const STORAGE_KEY = "iching-history";
const MAX_ENTRIES = 50;

/** 获取历史记录 */
export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

/** 保存一条记录 */
export function saveEntry(entry: HistoryEntry): void {
  if (typeof window === "undefined") return;

  try {
    const history = getHistory();
    history.unshift(entry); // 最新在前

    // 限制 50 条
    if (history.length > MAX_ENTRIES) {
      history.splice(MAX_ENTRIES);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage 不可用
  }
}

/** 清空历史 */
export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
