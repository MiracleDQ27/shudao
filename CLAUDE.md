# 书道 — 项目指南

> 把读书变成打怪升级，像素风可视化修行进度

## 项目定位

个人长期项目。手机端 IMA DeepSeek 做读书反馈和记录，我负责同步数据到网页端展示。

## 文档索引

| 文件 | 内容 |
|------|------|
| [DEV_LOG.md](docs/DEV_LOG.md) | 开发日志（每日记录） |
| [REQUIREMENTS.md](docs/REQUIREMENTS.md) | 需求与思路 |
| [TECH_STACK.md](docs/TECH_STACK.md) | 技术架构与选型 |
| [DESIGN.md](docs/DESIGN.md) | 设计规范（视觉/交互） |
| [ROADMAP.md](docs/ROADMAP.md) | 执行计划与路线图 |

## 工作规范

1. **分步推进**：每次只做 1-2 个任务，确保跑通再继续
2. **边写边教**：代码注释用中文，遇到不常见的概念顺手解释
3. **每次完结验证**：改完的东西确保能跑、能看
4. **日志先行**：每天开工先看 DEV_LOG.md，收工前更新
5. **Skill 优先**：涉及到的场景优先调用对应的 skill（vibe-learning-cn、ima-skill、simplify 等）

## 目录结构

```
/
├── index.html          # 主页面
├── style.css           # 全局样式
├── data.json           # 游戏数据
├── js/
│   ├── main.js         # 页面初始化
│   ├── radar-chart.js  # 雷达图
│   ├── particles.js    # 粒子效果
│   └── ...
├── css/
│   └── ...
├── docs/
│   ├── DEV_LOG.md
│   ├── REQUIREMENTS.md
│   ├── TECH_STACK.md
│   ├── DESIGN.md
│   └── ROADMAP.md
└── docs/superpowers/specs/
    └── *.md
```
