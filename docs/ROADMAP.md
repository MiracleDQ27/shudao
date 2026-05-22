# 执行路线图

## Phase 0：项目基础 ✅

- [x] 项目清理（极简骨架）
- [x] 5 条开发约定
- [x] Skill 安装（ima-skill、weread-skills、brainstorming）
- [x] IMA DeepSeek 记录指令定稿

## Phase 1：系统设计 ✅

- [x] 核心循环（读 → 聊 → 结算 → 可视化）
- [x] 等级体系（60 级 6 境）
- [x] 七维能力（七道修炼，10 段位）
- [x] Boss 链（小怪 → 章 Boss → 书 Boss）
- [x] 复习触发（知识点追 + 铭刻）
- [x] 修习统计（连续天数 + 总天数）
- [x] IMA + 微信读书双源对接
- [x] Claude 结算流程
- [x] DESIGN.md 定稿

## Phase 2：页面可视化设计 ✅

- [x] 视觉风格方向确认（暗色调国风 · 墨褐底金缀）
- [x] 布局定稿（全屏水墨画卷 · 三栏卡片浮动）
- [x] 配色/字体/交互/响应式策略
- [x] VISUAL_DESIGN.md 定稿

## Phase 3：前端实施 ✅

### v2 全屏水墨画卷（当前版本）
- [x] 全屏铺满布局，六层水墨远山背景 + 雾霭 + 绢本 grain
- [x] 顶栏（境界朱砂印 · 书道题字 · 修习统计）
- [x] 人物面板（头像/道号/修为条）
- [x] 灵根列表（七维段位 · 色标 · 进度条）
- [x] 灵根雷达图（SVG 七边形 · 7 轴线 · 水墨辉光滤镜）
- [x] 书域山河图（SVG 水墨地形 · 七域色区 · 山脊线）
- [x] 副本战历（Boss 列表按时间倒序 · 类型图标 + XP）
- [x] 感悟道藏 + 修习统计
- [x] backdrop-filter 半透明面板浮动
- [x] 入场动画（面板交错 fade-in）

### 代码审计修复（2026-05-22）
- [x] 雷达图 7 轴线修复（原只画了 3 条）
- [x] 最长连续天数修复（新增 longestStreak 字段）
- [x] streakBonuses 单源化（消除 settle.js 与 data.json 的重复）
- [x] 角色名空值显示 "undefined" 修复
- [x] 清理死参数/死变量

### 交互增强 + 代码健壮性（2026-05-22）
- [x] 灵根列表点击 → 雷达图联动高亮
- [x] 地图书籍标记（按 mainDim 显示书籍分布）
- [x] fetch 超时保护（10s AbortController）
- [x] innerHTML XSS 防护（esc 函数）
- [x] Firefox 滚动条兼容（scrollbar-width）
- [x] NaN 保护（timestamp 排序容错）
- [x] 移除 #loading 死样式

### 待迭代（已清空）
- [x] 手机竖屏适配
- [x] 部署 GitHub Pages（https://miracledq27.github.io/shudao/）

## Phase 4：结算管道 ✅

- [x] settle.js 结算计算引擎（纯计算，幂等设计）
- [x] SETTLEMENT.md 操作手册
- [x] CLAUDE.md "同步书道"命令注册
- [x] 首次同步验证（真实 API 跑通全流程）

## Phase 5：迭代 ⬅️ 当前

- [ ] 修习日历
- [ ] 长期使用反馈优化
