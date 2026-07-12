# 设计规范 — 周易运势

---

## 1. 色彩系统

| 角色 | 色值 | Tailwind | 用途 |
|------|------|----------|------|
| 主色 | `#A855F7` | `primary-500` | 按钮、标题、高亮 |
| 主色深 | `#7E22CE` | `primary-700` | 重要文字 |
| 主色浅 | `#F3E8FF` | `primary-100` | 背景装饰 |
| 背景 | `#F8F7FF` | 自定义 | 全局页面背景 |
| 卡片 | `#FFFFFF` | `white` | 卡片容器 |
| 宜/吉 | `#14B8A6` | `teal-500` | 宜标签 |
| 忌/凶 | `#F43F5E` | `rose-500` | 忌标签 |
| 幸运 | `#F59E0B` | `amber-500` | 幸运元素 |
| 文字主 | `#1E1E1E` | `gray-900` | 正文 |
| 文字次 | `#737373` | `gray-500` | 辅助文字 |
| 边框 | `#E5E5E5` | `gray-200` | 卡片边框 |

---

## 2. 字体

| 用途 | 大小 | 字重 |
|------|------|------|
| 页面标题 | `text-xl` (20px) | Bold (700) |
| 区域标题 | `text-base` (16px) | Bold (700) |
| 正文 | `text-sm` (14px) | Normal (400) |
| 辅助 | `text-xs` (12px) | Normal (400) |

字体栈：系统中文优先
```
-apple-system, BlinkMacSystemFont,
"PingFang SC", "Microsoft YaHei",
"Noto Sans CJK SC", sans-serif
```

---

## 3. 圆角与阴影

| 元素 | 圆角 | 阴影 |
|------|------|------|
| 卡片 | `16px` (rounded-card) | `shadow-card` |
| 输入框 | `12px` (rounded-input) | 无（focus ring） |
| 按钮 | `24px` (rounded-btn) | `shadow-btn` |
| Chip | `24px` (rounded-full) | 无 |

---

## 4. 组件规范

### 按钮
```
.btn-primary → bg-primary-500 text-white rounded-btn
               shadow-btn hover:bg-primary-600
```

### 卡片
```
.card → bg-white rounded-card shadow-card p-5
.card-hover → .card + hover:shadow-card-hover cursor-pointer
```

### 输入框
```
.input-primary → rounded-input border-gray-200
                 focus:ring-2 focus:ring-primary-400
```

---

## 5. 页面布局

- 最大宽度：`max-w-lg` (512px)，居中
- 移动端优先：375-428px 完美显示
- 底部无固定 Tab（与"今晚吃什么"不同）
- 页面间通过顶部返回按钮导航

---

## 6. 动画

| 元素 | 动画 |
|------|------|
| 页面进入 | `fadeIn` 0.5s |
| 卡片上滑 | `slideUp` 0.4s |
| 起卦中 | 铜钱 bounce |
| AI 文字 | 打字机逐字 + 闪烁光标 |
| 加载态 | 骨架屏 shimmer |
