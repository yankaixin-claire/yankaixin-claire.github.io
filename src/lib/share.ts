/**
 * 分享功能 — 占卜结果分享
 *
 * 优先使用 Web Share API（移动端原生分享）
 * 降级为复制到剪贴板
 */

import type { DivinationResult } from "@/types";

/** 生成分享文字 */
export function formatShareText(result: DivinationResult): string {
  const { primaryHexagram, transformedHexagram, changingLines } =
    result.castResult;

  let text = `🔮 周易占卜结果\n\n`;
  text += `❓ 问题：${result.question}\n\n`;
  text += `📖 本卦：${primaryHexagram.name}卦 ${primaryHexagram.symbol}\n`;
  text += `   卦辞：${primaryHexagram.description}\n`;

  if (changingLines.length > 0) {
    text += `⚡ 动爻：第 ${changingLines.join("、")} 爻\n`;
    changingLines.forEach((pos) => {
      const lineText = primaryHexagram.lines[pos - 1] || "";
      text += `   第${pos}爻：${lineText}\n`;
    });
  }

  if (transformedHexagram) {
    text += `🔄 变卦：${transformedHexagram.name}卦 ${transformedHexagram.symbol}\n`;
  }

  // 摘要（取解读的前 150 字）
  const summary =
    result.interpretation.replace(/[#*_`>]/g, "").slice(0, 150) + "…";
  text += `\n💬 解读：${summary}\n`;
  text += `\n——来自「周易运势」☯️`;

  return text;
}

/** 尝试原生分享，失败则复制到剪贴板 */
export async function shareResult(result: DivinationResult): Promise<{
  success: boolean;
  method: "share" | "clipboard" | "failed";
}> {
  const text = formatShareText(result);

  // 1. 尝试 Web Share API
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: `周易占卜：${result.question.slice(0, 20)}`,
        text,
      });
      return { success: true, method: "share" };
    } catch (err) {
      // 用户取消也算失败，继续尝试剪贴板
      if (err instanceof Error && err.name === "AbortError") {
        return { success: false, method: "failed" };
      }
    }
  }

  // 2. 降级：复制到剪贴板
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, method: "clipboard" };
    } catch {
      return { success: false, method: "failed" };
    }
  }

  return { success: false, method: "failed" };
}
