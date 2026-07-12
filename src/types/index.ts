/** 爻的值：6=老阴(变) 7=少阳 8=少阴 9=老阳(变) */
export type LineValue = 6 | 7 | 8 | 9;

/** 单条爻 */
export interface YaoLine {
  position: number; // 1-6, 从下往上
  value: LineValue;
  isYang: boolean; // 阳爻 (7/9)
  isChanging: boolean; // 动爻 (6/9)
}

/** 八卦 */
export type Trigram =
  | "乾"
  | "兑"
  | "离"
  | "震"
  | "巽"
  | "坎"
  | "艮"
  | "坤";

/** 卦象 */
export interface HexagramData {
  id: number; // 1-64
  name: string; // 卦名
  upperTrigram: Trigram;
  lowerTrigram: Trigram;
  symbol: string; // Unicode 卦符
  description: string; // 卦辞
  judgment: string; // 彖传
  image: string; // 象传
  lines: string[]; // 六爻爻辞 [初爻...上爻]
}

/** 起卦结果 */
export interface CastResult {
  lines: YaoLine[]; // 六爻详情
  primaryHexagram: HexagramData; // 本卦
  changingLines: number[]; // 动爻位置 (1-6)
  transformedHexagram: HexagramData | null; // 变卦（无动爻时为 null）
}

/** 占卜完整结果 */
export interface DivinationResult {
  castResult: CastResult;
  interpretation: string; // AI 解读
  question: string; // 用户问题
  timestamp: number;
}

/** 每日运势 */
export interface DailyFortune {
  date: string; // YYYY-MM-DD
  hexagram: HexagramData; // 当日卦象
  yi: string[]; // 宜
  ji: string[]; // 忌
  luckyColor: {
    name: string;
    hex: string;
  };
  luckyNumber: number;
  summary: string; // 一句话概述
}

/** 历史记录 */
export interface HistoryEntry {
  id: string;
  question: string;
  hexagramName: string;
  hexagramId: number;
  summary: string; // 解读摘要（前100字）
  timestamp: number;
}

/** API 统一响应 */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
