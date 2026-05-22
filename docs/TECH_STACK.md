# 技术架构

## 技术选型

| 层面 | 选型 | 说明 |
|------|------|------|
| 前端框架 | 原生 HTML/CSS/JS + Three.js | 3D 可视化（地球仪/雷达图） |
| 3D 引擎 | Three.js v0.160 CDN | import map 方式加载 |
| 字体 | Noto Serif SC + Press Start 2P | 中文衬线 + 像素风英文 |
| 数据存储 | data.json | Claude 定期写入 |
| 托管 | GitHub Pages | 静态站点 |
| 数据源 1 | 微信读书 (weread-skills) | 官方 Agent API，2026.5.16 发布 |
| 数据源 2 | IMA DeepSeek (ima-skill) | IMA OpenAPI，笔记读写 |

## 数据流

```
微信读书 API ──→ 阅读进度、时长、天数
IMA 笔记 ──────→ 理解评分、书域、复习
        ↘         ↙
      Claude 结算引擎
           ↓
        data.json
           ↓
      网页可视化
```

## 目录结构

```
/
├── index.html          # 前端页面（待设计）
├── data.json           # 游戏数据
├── ref/                # 设计参考图
├── docs/
│   ├── DESIGN.md       # 系统设计
│   ├── REQUIREMENTS.md # 需求
│   ├── TECH_STACK.md   # 技术架构（本文件）
│   ├── ROADMAP.md      # 路线图
│   └── DEV_LOG.md      # 开发日志
└── CLAUDE.md           # 项目指南
```

### Skills 依赖

| Skill | 位置 | 用途 |
|-------|------|------|
| ima-skill | ~/.claude/skills/ima-skill/ | 读取 IMA 笔记 |
| weread-skills | ~/.claude/skills/weread-skills/ | 微信读书 API |
