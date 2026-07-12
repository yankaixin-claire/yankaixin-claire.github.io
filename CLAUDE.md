# CLAUDE.md — 赛博周易运势

## 项目概述

「周易运势」是一个基于周易六十四卦的 AI 占卜运势 Web 应用。用户可查看每日宜忌、搜索卦象、输入问题进行 AI 占卜解读。

## 技术栈

- **框架**: Next.js 14 (App Router) + TypeScript
- **样式**: Tailwind CSS 3.x（紫色主题）
- **AI**: DeepSeek API（主）/ Claude API（可选）
- **存储**: 静态数据 + localStorage（无数据库）

## 标准文件路径

| 类型 | 路径 | 说明 |
|------|------|------|
| 需求文档 | `docs/requirements.md` | 产品需求、用户故事、功能范围 |
| 技术设计 | `docs/technical-design.md` | 架构、数据模型、API 设计 |
| 设计规范 | `docs/design-spec.md` | UI 色彩、字体、组件规范 |
| 开发计划 | `docs/development-plan.md` | 分阶段开发步骤 |
| 开发日志 | `devlog/YYYY-MM-DD.md` | 每日开发记录 |
| 日志模板 | `devlog/template.md` | 日志格式模板 |

## 工作说明

### 开发原则

1. **小步迭代** — 每次只做一个功能模块，确认可用后再进行下一步
2. **先跑通再优化** — 优先保证功能可用，再打磨细节
3. **每次改动前先确认** — 修改已有代码前，先读文件了解当前状态
4. **每个阶段完成后记录日志** — 更新 `devlog/` 中的当日日志

### 开发流程

1. 从 `docs/development-plan.md` 确认当前阶段
2. 阅读相关规范文档（requirements / design-spec）
3. 实现功能
4. `npm run build` 验证无错误
5. 启动 `npm run dev` 手动验证
6. 更新 `devlog/` 记录进度

### 关键命令

```bash
npm run dev      # 启动开发服务器 (localhost:3001)
npm run build    # 生产构建 + 类型检查
npm run lint     # ESLint 检查
```

### 项目结构

```
src/
├── app/
│   ├── page.tsx              # 首页（每日运势 + 问答入口）
│   ├── layout.tsx            # 根布局
│   ├── globals.css           # 全局样式 + Tailwind
│   ├── search/page.tsx       # 卦象搜索
│   ├── divine/page.tsx       # 占卜结果
│   ├── hexagram/[id]/page.tsx # 卦象详情
│   ├── api/divine/route.ts   # POST 占卜 API
│   └── api/daily/route.ts    # GET 每日运势 API
├── lib/
│   ├── iching.ts             # 起卦算法 + 64卦逻辑
│   ├── claude.ts             # AI API 封装
│   └── storage.ts            # localStorage 管理
├── data/
│   └── hexagrams.ts          # 64卦完整数据
└── types/
    └── index.ts              # TypeScript 类型
```

## 当前状态

- ✅ Phase 1: 项目骨架 + 64卦数据 + 起卦算法
- ✅ Phase 2: AI 集成（DeepSeek + Claude 双支持）
- ✅ Phase 3: 首页仪表盘（每日运势卡片 + Q&A + 热门问题）
- ✅ Phase 4: 搜索页 + 卦象详情页
- ✅ Phase 5: 占卜结果页（起卦动画 + 卦象展示 + AI 解读打字机效果）
- 🔜 待优化: 响应式适配测试、错误处理完善、loading 状态打磨
