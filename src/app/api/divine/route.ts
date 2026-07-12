/**
 * POST /api/divine — 占卜问答
 *
 * 接收用户问题 → 起卦 → AI 解卦
 */

import { NextRequest, NextResponse } from "next/server";
import { castHexagram } from "@/lib/iching";
import { interpretDivination } from "@/lib/claude";
import type { ApiResponse, ApiError, DivinationResult } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    // 校验
    if (!question || typeof question !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_INPUT", message: "请输入你想问的问题" },
        } as ApiError,
        { status: 400 }
      );
    }

    const q = question.trim();
    if (q.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "TOO_SHORT", message: "问题至少需要 2 个字" },
        } as ApiError,
        { status: 400 }
      );
    }
    if (q.length > 200) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "TOO_LONG", message: "问题请控制在 200 字以内" },
        } as ApiError,
        { status: 400 }
      );
    }

    // 起卦
    const castResult = castHexagram();

    // 准备动爻文本
    const changingLinesText = castResult.changingLines.map((pos) => {
      const lineIdx = pos - 1; // 转为 0-index
      return castResult.primaryHexagram.lines[lineIdx] || "";
    });

    // AI 解卦
    const interpretation = await interpretDivination(
      q,
      castResult.primaryHexagram.name,
      castResult.primaryHexagram.symbol,
      castResult.primaryHexagram.description,
      castResult.primaryHexagram.judgment,
      castResult.changingLines,
      changingLinesText,
      castResult.transformedHexagram?.name || null
    );

    const result: DivinationResult = {
      castResult,
      interpretation,
      question: q,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      success: true,
      data: result,
    } as ApiResponse<DivinationResult>);
  } catch (error) {
    console.error("占卜失败:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "占卜失败，请稍后再试" },
      } as ApiError,
      { status: 500 }
    );
  }
}
