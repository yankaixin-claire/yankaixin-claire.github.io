/**
 * 周易起卦算法
 *
 * 三钱法（火珠林法）：
 *   - 每爻掷 3 枚铜钱
 *   - 3 正 = 老阳 (9) → 动爻
 *   - 2 正 1 反 = 少阳 (7) → 静爻
 *   - 1 正 2 反 = 少阴 (8) → 静爻
 *   - 3 反 = 老阴 (6) → 动爻
 *
 * 动爻会变（阴变阳、阳变阴）→ 产生变卦
 */

import { HEXAGRAMS, getHexagramIdByTrigrams } from "@/data/hexagrams";
import type {
  YaoLine,
  LineValue,
  Trigram,
  CastResult,
  HexagramData,
} from "@/types";

const TRIGRAMS: Trigram[] = ["乾", "兑", "离", "震", "巽", "坎", "艮", "坤"];

/** 模拟掷一枚铜钱 */
function tossCoin(): boolean {
  return Math.random() < 0.5;
}

/** 掷三枚铜钱，返回 6/7/8/9 */
function castLine(): LineValue {
  const heads = [tossCoin(), tossCoin(), tossCoin()].filter(Boolean).length;
  switch (heads) {
    case 3:
      return 9; // 老阳
    case 2:
      return 7; // 少阳
    case 1:
      return 8; // 少阴
    case 0:
      return 6; // 老阴
    default:
      return 7;
  }
}

/** 判断爻是否为阳 */
function isYangLine(value: LineValue): boolean {
  return value === 7 || value === 9;
}

/** 判断爻是否动爻 */
function isChangingLine(value: LineValue): boolean {
  return value === 6 || value === 9;
}

/** 由三爻查找八卦 */
function findTrigram(lines: number[]): Trigram {
  // lines: [下, 中, 上], 1=阳 0=阴
  const key = lines.join("");
  const map: Record<string, Trigram> = {
    "111": "乾",
    "110": "兑",
    "101": "离",
    "100": "震",
    "011": "巽",
    "010": "坎",
    "001": "艮",
    "000": "坤",
  };
  return map[key] || "乾";
}

/**
 * 起卦：随机生成六爻 → 推导本卦和变卦
 */
export function castHexagram(): CastResult {
  // 生成六爻 (从初爻到上爻)
  const lines: YaoLine[] = [];
  for (let i = 1; i <= 6; i++) {
    const value = castLine();
    lines.push({
      position: i,
      value,
      isYang: isYangLine(value),
      isChanging: isChangingLine(value),
    });
  }

  // 本卦：用静爻状态（变爻按当前状态）
  const lowerLines = lines.slice(0, 3).map((l) => (isYangLine(l.value) ? 1 : 0));
  const upperLines = lines.slice(3, 6).map((l) => (isYangLine(l.value) ? 1 : 0));
  const lowerTrigram = findTrigram(lowerLines);
  const upperTrigram = findTrigram(upperLines);

  const primaryId = getHexagramIdByTrigrams(upperTrigram, lowerTrigram);
  const primaryHexagram = HEXAGRAMS[primaryId];

  // 变卦：变爻翻转
  const changingLines = lines.filter((l) => l.isChanging).map((l) => l.position);

  let transformedHexagram: HexagramData | null = null;
  if (changingLines.length > 0) {
    const changedLines = lines.map((l) => {
      if (l.isChanging) {
        const newVal: LineValue = l.value === 6 ? 7 : 8; // 老阴变少阳, 老阳变少阴
        return newVal;
      }
      return l.value;
    });
    const changedLower = changedLines.slice(0, 3).map((v) => (isYangLine(v as LineValue) ? 1 : 0));
    const changedUpper = changedLines.slice(3, 6).map((v) => (isYangLine(v as LineValue) ? 1 : 0));
    const changedLowerTri = findTrigram(changedLower);
    const changedUpperTri = findTrigram(changedUpper);

    const transformedId = getHexagramIdByTrigrams(changedUpperTri, changedLowerTri);
    transformedHexagram = HEXAGRAMS[transformedId] || null;
  }

  return {
    lines,
    primaryHexagram,
    changingLines,
    transformedHexagram,
  };
}

/**
 * 简单的每日卦象（基于日期种子，确保当天一致）
 */
export function getDailyHexagramSeed(): number {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  // 简单 hash
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) % 64;
  }
  return hash + 1; // 1-64
}

// ===== 五行系统 =====

/**
 * 八卦 → 五行映射
 * 乾兑属金，离属火，震巽属木，坎属水，艮坤属土
 */
const TRIGRAM_ELEMENT: Record<Trigram, "金" | "木" | "水" | "火" | "土"> = {
  乾: "金", 兑: "金",
  离: "火",
  震: "木", 巽: "木",
  坎: "水",
  艮: "土", 坤: "土",
};

/** 五行 → 幸运色 */
const ELEMENT_COLORS: Record<string, { name: string; hex: string }[]> = {
  金: [
    { name: "金色", hex: "#F59E0B" },
    { name: "银白", hex: "#E5E7EB" },
    { name: "香槟金", hex: "#FDE68A" },
  ],
  木: [
    { name: "翠绿", hex: "#10B981" },
    { name: "嫩绿", hex: "#A3E635" },
    { name: "青碧", hex: "#06B6D4" },
  ],
  水: [
    { name: "深蓝", hex: "#3B82F6" },
    { name: "墨蓝", hex: "#1E3A5F" },
    { name: "天青", hex: "#60A5FA" },
  ],
  火: [
    { name: "朱红", hex: "#EF4444" },
    { name: "玫红", hex: "#EC4899" },
    { name: "紫红", hex: "#A855F7" },
  ],
  土: [
    { name: "琥珀", hex: "#D97706" },
    { name: "赭石", hex: "#B45309" },
    { name: "暖棕", hex: "#92400E" },
  ],
};

/** 五行 → 幸运数字范围 */
const ELEMENT_NUMBER_RANGE: Record<string, [number, number]> = {
  金: [1, 9],
  木: [3, 8],
  水: [1, 6],
  火: [2, 7],
  土: [5, 10],
};

/**
 * 根据卦象的上下卦五行，返回该卦主导的五行
 * 规则：下卦（内卦）为主，上卦（外卦）为辅
 */
export function getHexagramElement(hexagram: {
  upperTrigram: Trigram;
  lowerTrigram: Trigram;
}): { primary: string; secondary: string } {
  return {
    primary: TRIGRAM_ELEMENT[hexagram.lowerTrigram],
    secondary: TRIGRAM_ELEMENT[hexagram.upperTrigram],
  };
}

/** 基于卦象五行选择幸运颜色 */
export function getLuckyColor(
  upperTrigram: Trigram,
  lowerTrigram: Trigram
): { name: string; hex: string } {
  const element = TRIGRAM_ELEMENT[lowerTrigram]; // 以内卦五行为主
  const colors = ELEMENT_COLORS[element];
  // 基于日期在3个颜色中轮换
  const idx = new Date().getDate() % colors.length;
  return colors[idx];
}

/** 基于卦象五行生成幸运数字 */
export function getLuckyNumber(
  upperTrigram: Trigram,
  lowerTrigram: Trigram
): number {
  const element = TRIGRAM_ELEMENT[lowerTrigram];
  const [min, max] = ELEMENT_NUMBER_RANGE[element];
  // 基于日期种子在范围内循环
  const seed = (new Date().getDate() * 7 + new Date().getMonth() * 3) % (max - min + 1);
  return min + seed;
}

/** 获取卦象的五行描述 */
export function getElementDescription(
  upperTrigram: Trigram,
  lowerTrigram: Trigram
): string {
  const { primary, secondary } = getHexagramElement({ upperTrigram, lowerTrigram });
  if (primary === secondary) {
    return `五行属${primary}，${primary}气纯和`;
  }
  return `内卦属${primary}，外卦属${secondary}，${primary}${secondary}相生`;
}
