/**
 * GET /api/daily — 每日运势
 *
 * 基于当日日期种子确定卦象 → 结合五行 → AI 深度解读
 */

import { NextResponse } from "next/server";
import {
  getDailyHexagramSeed,
  getLuckyColor,
  getLuckyNumber,
  getElementDescription,
} from "@/lib/iching";
import { generateDailyFortune } from "@/lib/claude";
import { HEXAGRAMS } from "@/data/hexagrams";
import type { ApiResponse, DailyFortune } from "@/types";

export async function GET() {
  try {
    const hexagramId = getDailyHexagramSeed();
    const hexagram = HEXAGRAMS[hexagramId];

    // 五行
    const elementDesc = getElementDescription(
      hexagram.upperTrigram,
      hexagram.lowerTrigram
    );
    const luckyColor = getLuckyColor(hexagram.upperTrigram, hexagram.lowerTrigram);
    const luckyNumber = getLuckyNumber(hexagram.upperTrigram, hexagram.lowerTrigram);

    // AI 生成每日宜忌（传入完整卦象数据）
    const aiFortune = await generateDailyFortune(
      hexagram.name,
      hexagram.symbol,
      hexagram.upperTrigram,
      hexagram.lowerTrigram,
      hexagram.description,
      hexagram.judgment,
      hexagram.image,
      hexagram.lines,
      elementDesc
    );

    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const fortune: DailyFortune = {
      date: dateStr,
      hexagram,
      yi: aiFortune?.yi || [],
      ji: aiFortune?.ji || [],
      luckyColor,
      luckyNumber,
      summary: aiFortune?.summary || "",
    };

    return NextResponse.json({
      success: true,
      data: fortune,
    } as ApiResponse<DailyFortune>);
  } catch (error) {
    console.error("每日运势获取失败:", error);
    return fallbackResponse();
  }
}

/** 降级：纯本地数据（无 AI） */
function fallbackResponse() {
  const hexagramId = getDailyHexagramSeed();
  const hexagram = HEXAGRAMS[hexagramId];
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return NextResponse.json({
    success: true,
    data: {
      date: dateStr,
      hexagram,
      yi: ["静心读书", "整理家务", "向内自省"],
      ji: ["冲动决策", "与人争执", "过度消耗"],
      luckyColor: getLuckyColor(hexagram.upperTrigram, hexagram.lowerTrigram),
      luckyNumber: getLuckyNumber(hexagram.upperTrigram, hexagram.lowerTrigram),
      summary: `今日得**${hexagram.name}卦**——${hexagram.description.slice(0, 20)}`,
    } as DailyFortune,
  } as ApiResponse<DailyFortune>);
}
