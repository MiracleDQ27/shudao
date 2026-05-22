# 书道 — 项目指南

> 把读书变成打怪升级，可视化修行进度

## 项目定位

**核心**：读书反馈闭环。读 → 写理解 → 可视化成长 → 调整方向。

**三端分工**：
| 端 | 职责 |
|----|------|
| 微信读书 + IMA DeepSeek（手机） | 读 + AI 陪聊理解 + 自动追加笔记 |
| Claude | 拉微信读书 API + IMA 笔记 → 结算 XP/维度/Boss → 写入 data.json |
| 网页（GitHub Pages） | 纯可视化展示 data.json，不分析不社交 |

**边界**：目前单人使用，后续再考虑多人。

> 当前状态：系统设计定稿（DESIGN.md），待页面可视化设计。

## 已安装 Skills

| Skill | 用途 |
|-------|------|
| ima-skill | 读取 IMA 笔记（理解评分、书域、复习记录） |
| weread-skills | 微信读书 API（书架、进度、时长、统计） |
| brainstorming | 设计流程 |
| writing-plans | 实施前计划 |
| frontend-design | 视觉改版 |

## 开发约定

### 1. Skill 调用纪律
任何任务开始前，先判断是否有对应 skill。有（哪怕 1% 可能）→ 必须 Skill tool 调用。特别是：
- brainstorming → 设计前
- writing-plans → 实施前
- frontend-design → 视觉改版前

不跳过、不凭记忆假装调了。

### 2. 文档同步纪律
| 变更 | 更新 |
|------|------|
| 设计变更 | DESIGN.md |
| 技术决策/架构变动 | TECH_STACK.md |
| 需求变更 | REQUIREMENTS.md |
| 阶段推进 | ROADMAP.md |
| 每次会话收工 | DEV_LOG.md |
| 用户反馈 | 立刻记入 DEV_LOG.md |

### 3. 步进式推进
每次只做一个阶段。完成 → 验证 → 再继续。不跳步、不并行推进不相关任务。

### 4. Memory 使用
关键约定和决策写入 `.claude/projects/*/memory/` 跨会话保留。每次开工先读 MEMORY.md 回顾上下文。

### 5. 先计划后实施
非 trivial 任务必须先 plan mode，用户确认后再实施。

## 文档索引

| 文件 | 内容 |
|------|------|
| [DESIGN.md](docs/DESIGN.md) | 系统设计（等级、七维、Boss、复习、IMA 对接） |
| [REQUIREMENTS.md](docs/REQUIREMENTS.md) | 需求文档 |
| [TECH_STACK.md](docs/TECH_STACK.md) | 技术架构 |
| [ROADMAP.md](docs/ROADMAP.md) | 路线图 |
| [DEV_LOG.md](docs/DEV_LOG.md) | 开发日志 |

## 目录结构

```
/
├── index.html          # 极简骨架（等待页面设计）
├── ref/                # 设计参考截图
├── data.json           # 游戏数据（唯一数据源，待按新系统重构）
├── docs/
│   ├── DESIGN.md       # 系统设计
│   ├── REQUIREMENTS.md # 需求
│   ├── TECH_STACK.md   # 技术架构
│   ├── ROADMAP.md      # 路线图
│   └── DEV_LOG.md      # 开发日志
└── CLAUDE.md           # 项目指南（本文件）
```
