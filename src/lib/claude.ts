/**
 * AI API 封装 — 周易占卜解读
 *
 * 支持：Claude API → DeepSeek API → 降级模板
 */

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

function getProvider(): "claude" | "deepseek" | null {
  if (process.env.CLAUDE_API_KEY) return "claude";
  if (process.env.DEEPSEEK_API_KEY) return "deepseek";
  return null;
}

// ===== 占卜解读 Prompt =====

function buildDivinationPrompt(
  question: string,
  hexagramName: string,
  hexagramSymbol: string,
  hexagramDesc: string,
  hexagramJudgment: string,
  changingLines: number[],
  changingLinesText: string[],
  transformedName: string | null
): string {
  return `你是精通《周易》的占卜师。请根据以下卦象信息，为用户的问题提供运势解读。

## 用户问题
${question}

## 卦象信息
- 本卦：**${hexagramName}** ${hexagramSymbol}
- 卦辞：${hexagramDesc}
- 彖传：${hexagramJudgment}${
    changingLines.length > 0
      ? `\n- 动爻：第 ${changingLines.join("、")} 爻\n- 动爻爻辞：\n${changingLinesText
          .map((t, i) => `  第${changingLines[i]}爻：${t}`)
          .join("\n")}`
      : ""
  }${transformedName ? `\n- 变卦：**${transformedName}**` : ""}

## 输出要求
请用一段话（200-400字）为用户解读运势，要求：
1. 先解释卦象的核心含义（1-2句）
2. 结合用户的问题给出针对性建议
3. 如果有动爻，重点解读动爻的启示
4. 语气温和、有智慧感，像一位有经验的长者在给建议
5. 最后给一句简短的总结语（用"——"开头）

只输出解读文字，不要重复卦象信息。`;
}

// ===== 每日运势 Prompt =====

function buildDailyPrompt(
  hexagramName: string,
  hexagramSymbol: string,
  upperTrigram: string,
  lowerTrigram: string,
  hexagramDesc: string,
  hexagramJudgment: string,
  hexagramImage: string,
  hexagramLines: string[],
  elementDesc: string
): string {
  const today = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 六爻摘要
  const linesSummary = hexagramLines
    .map((text, i) => {
      const labels = ["初", "二", "三", "四", "五", "上"];
      return `${labels[i]}爻：${text}`;
    })
    .join("\n");

  return `你是精通《周易》的资深占卜师。请根据今日卦象的深层哲学含义，生成有针对性、有依据的每日运势指导。

## 今日：${today}
## 今日卦象：**${hexagramName}卦** ${hexagramSymbol}（${upperTrigram}上${lowerTrigram}下）
## ${elementDesc}

### 经文
**卦辞**：${hexagramDesc}
**彖传**：${hexagramJudgment}
**象传**：${hexagramImage}

### 六爻爻辞
${linesSummary}

---

## 任务要求

请深入理解此卦的核心哲学（彖传揭示的天地之道、象传揭示的君子之行），然后生成今日宜忌。

**关键原则：**
1. 每条「宜」和「忌」必须能在此卦的经文（卦辞/彖传/象传/爻辞）中找到依据
2. 不要给泛泛的通用建议（如"多喝水""早睡早起"），要体现此卦独有的智慧
3. 用现代人能理解的语言诠释古经，但保留哲理深度
4. summary 要抓住此卦最核心的精神，让人读后有所悟

**示例——如果是"乾卦"：**
- 宜："主动展现才华，把握时机进取"（依据：飞龙在天，利见大人）
- 忌："刚愎自用，不知收敛锋芒"（依据：亢龙有悔）
- summary："天行健，君子以自强不息"

**示例——如果是"坤卦"：**
- 宜："以柔克刚，用包容化解冲突"（依据：坤厚载物，德合无疆）
- 忌："强出头争功，失去本位"（依据：先迷后得主）

---

## 输出格式（只输出 JSON，不要其他文字）

{
  "yi": [
    "具体宜做的事 + 一句话解释卦象依据",
    ...
  ],
  "ji": [
    "具体忌做的事 + 一句话解释卦象依据",
    ...
  ],
  "summary": "卦象核心启示（20字以内，体现彖传/象传精神）"
}`;
}

// ===== API 调用 =====

/** 提取 JSON 对象 */
function extractJSON(text: string): Record<string, unknown> | null {
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

/** 通用 AI 调用 */
async function callAI(systemPrompt: string, userMessage: string): Promise<string> {
  const provider = getProvider();
  if (!provider) throw new Error("未配置 AI API Key");

  if (provider === "claude") {
    return callClaude(systemPrompt, userMessage);
  }
  return callDeepSeek(systemPrompt, userMessage);
}

async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CLAUDE_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`Claude API ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || "";
}

async function callDeepSeek(systemPrompt: string, userMessage: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      max_tokens: 800,
      temperature: 0.9,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`DeepSeek API ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// ===== 公开接口 =====

/**
 * AI 占卜解读
 */
export async function interpretDivination(
  question: string,
  hexagramName: string,
  hexagramSymbol: string,
  hexagramDesc: string,
  hexagramJudgment: string,
  changingLines: number[],
  changingLinesText: string[],
  transformedName: string | null
): Promise<string> {
  const provider = getProvider();
  if (!provider) {
    // 降级：返回模板化解读
    return buildFallbackInterpretation(
      hexagramName,
      hexagramDesc,
      changingLines,
      changingLinesText,
      transformedName
    );
  }

  try {
    const prompt = buildDivinationPrompt(
      question,
      hexagramName,
      hexagramSymbol,
      hexagramDesc,
      hexagramJudgment,
      changingLines,
      changingLinesText,
      transformedName
    );
    return await callAI(
      "你是精通《周易》的占卜师，给用户提供温暖、有智慧的运势解读。用中文回答。",
      prompt
    );
  } catch (error) {
    console.error("AI 解读失败:", error);
    return buildFallbackInterpretation(
      hexagramName,
      hexagramDesc,
      changingLines,
      changingLinesText,
      transformedName
    );
  }
}

/**
 * AI 每日运势（传入完整卦象数据，确保深度结合周易）
 */
export async function generateDailyFortune(
  hexagramName: string,
  hexagramSymbol: string,
  upperTrigram: string,
  lowerTrigram: string,
  hexagramDesc: string,
  hexagramJudgment: string,
  hexagramImage: string,
  hexagramLines: string[],
  elementDesc: string
): Promise<{
  yi: string[];
  ji: string[];
  summary: string;
} | null> {
  const provider = getProvider();
  if (!provider) {
    return getDefaultDailyFortune(hexagramName);
  }

  try {
    const prompt = buildDailyPrompt(
      hexagramName,
      hexagramSymbol,
      upperTrigram,
      lowerTrigram,
      hexagramDesc,
      hexagramJudgment,
      hexagramImage,
      hexagramLines,
      elementDesc
    );
    const text = await callAI(
      "你是精通《周易》和五行的占卜师。请仔细理解卦象的深层哲学，给出有经文依据的宜忌建议。只输出 JSON，不要其他内容。",
      prompt
    );
    const json = extractJSON(text);
    if (json) {
      return {
        yi: (json.yi as string[]) || [],
        ji: (json.ji as string[]) || [],
        summary: (json.summary as string) || "",
      };
    }
    return getDefaultDailyFortune(hexagramName);
  } catch (error) {
    console.error("每日运势生成失败:", error);
    return getDefaultDailyFortune(hexagramName);
  }
}

// ===== 降级方案 =====

function buildFallbackInterpretation(
  hexagramName: string,
  hexagramDesc: string,
  changingLines: number[],
  changingLinesText: string[],
  transformedName: string | null
): string {
  let text = `你抽到的是 **${hexagramName}卦**。\n\n`;
  text += `卦辞云："${hexagramDesc}"\n\n`;
  text += "此卦提示你当前所处的阶段需要耐心和智慧。";

  if (changingLines.length > 0) {
    text += `\n\n动爻在第 ${changingLines.join("、")} 爻，`;
    text += "这表示你正处在变化的关键节点上。";
    changingLinesText.forEach((t, i) => {
      text += `\n\n第${changingLines[i]}爻曰："${t}"`;
    });
  }

  if (transformedName) {
    text += `\n\n变卦为**${transformedName}卦**，预示着事情将朝着这个方向发展。`;
  }

  text += `\n\n——静观其变，顺势而为。`;
  return text;
}

function getDefaultDailyFortune(hexagramName?: string): {
  yi: string[];
  ji: string[];
  summary: string;
} {
  const name = hexagramName || "今日";
  return {
    yi: ["静心读书，增长智慧", "整理事务，理清头绪", "善待他人，广结善缘"],
    ji: ["冲动决策，意气用事", "与人争执，耗损和气", "过度消耗，不知节制"],
    summary: `今日得**${name}卦**，宜静不宜动，守成为上策。`,
  };
}
