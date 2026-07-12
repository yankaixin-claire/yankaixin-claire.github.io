# 技术设计文档 — 周易运势

---

## 1. 架构概览

```
用户浏览器 (375-428px 移动端)
        │
        ▼
Next.js 14 服务端
  ├── App Router (页面 SSR/CSR)
  ├── API Routes (REST)
  └── Lib 层
        ├── iching.ts  (起卦算法)
        ├── claude.ts  (AI 封装)
        └── storage.ts (localStorage)
              │
              ▼
         DeepSeek / Claude API
```

**关键决策：无数据库 MVP**
- 64 卦数据 → TypeScript 静态常量
- 历史记录 → localStorage
- 每日运势 → 日期种子 + AI（客户端缓存）

---

## 2. 技术栈

| 层 | 选型 | 理由 |
|----|------|------|
| 框架 | Next.js 14 App Router | SSR + API 一体化 |
| 样式 | Tailwind CSS 3.x | 快速构建，紫色主题配置简单 |
| AI 主 | DeepSeek API | 性价比高，中文能力强 |
| AI 备 | Claude API | 可选，效果更好 |
| 存储 | 静态数据 + localStorage | 零运维 MVP |

---

## 3. 数据模型

### 3.1 64卦系统

```typescript
// 起卦：三钱法随机生成六爻
// 3正=老阳(9)→动爻, 2正1反=少阳(7), 1正2反=少阴(8), 3反=老阴(6)→动爻

interface YaoLine {
  position: number;    // 1-6 从下往上
  value: 6 | 7 | 8 | 9;
  isYang: boolean;
  isChanging: boolean; // 6或9为动爻 → 产生变卦
}

interface HexagramData {
  id: number;          // 1-64
  name: string;        // 卦名
  symbol: string;      // Unicode 卦符 ䷀-䷿
  description: string; // 卦辞
  judgment: string;    // 彖传
  image: string;       // 象传
  lines: string[];     // 六爻爻辞 [初爻...上爻]
}
```

### 3.2 存储

```
localStorage key: "iching-history"
Value: HistoryEntry[] (JSON, max 50 entries)
```

---

## 4. API 设计

### POST /api/divine

```
请求: { "question": "我该跳槽吗？" }
响应: {
  success: true,
  data: {
    castResult: { lines, primaryHexagram, changingLines, transformedHexagram },
    interpretation: "AI 解读文字...",
    question, timestamp
  }
}
```

### GET /api/daily

```
响应: {
  success: true,
  data: {
    date, hexagram,
    yi: ["宜1","宜2","宜3"],
    ji: ["忌1","忌2","忌3"],
    luckyColor: { name, hex },
    luckyNumber: 42,
    summary: "一句话概述"
  }
}
```

---

## 5. AI Prompt 策略

### 占卜解读
- System: 精通周易的占卜师
- 注入：卦名、卦辞、彖传、动爻爻辞
- 输出：200-400 字个性化解读 + 总结

### 每日运势
- System: 周易占卜师
- 注入：当日卦象、卦辞、象传
- 输出：JSON { yi[], ji[], summary }

---

## 6. 降级策略

```
AI 可用？
  ├─ 是 → AI 解读（个性化宜忌+占卜解读）
  └─ 否 → 本地降级：
            - 每日运势：默认宜忌模板
            - 占卜：卦辞+爻辞模板拼装
```
