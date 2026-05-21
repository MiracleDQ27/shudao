# 技术架构

> 技术选型、架构决策和文件结构

## 架构概览

```
手机端                         电脑端                         网页端
IMA DeepSeek ──IMA API──→  Claude Code ──写文件──→  纯静态页面
  (反馈/记录)              (数据同步)              (GitHub Pages)
                                  ↑
                          微信读书 API
                          (自动检测进度)
```

## 技术选型

| 层面 | 选型 | 理由 |
|------|------|------|
| 前端框架 | 无（纯 HTML + CSS + JS） | 零依赖，直接部署，改起来简单 |
| 数据存储 | data.json（本地文件） | 单文件，我直接读写 |
| 托管 | GitHub Pages | 免费、支持 HTTPS、手机可访问 |
| 字体 | Press Start 2P（Google Fonts） | 像素风 |
| 雷达图 | Canvas 自绘 | 不需要第三方库，灵活可控 |
| 粒子效果 | 独立 JS 文件 | 后期可换第三方库 |

## 为什么不用框架

纯 HTML/CSS/JS 对这个项目更合适：
1. 没有构建步骤，本地双击就能打开
2. 部署到 GitHub Pages 不需要配置
3. 数据层（data.json）和渲染层分离，以后要换框架只换渲染层

## data.json 数据流

```
IMA DeepSeek → 写 IMA 笔记（固定格式）
                    ↓
Claude Code → 读 IMA API → 解析 → 写入 data.json
                    ↓
网页端 → fetch('data.json') → 渲染 DOM
```

## 目录结构

```
/
├── index.html          # 主页面
├── style.css           # 全局样式
├── data.json           # 游戏数据（由 Claude 更新）
├── js/
│   ├── main.js         # 页面初始化 + 数据加载
│   ├── radar-chart.js  # 七维雷达图 Canvas 绘制
│   ├── particles.js    # 粒子效果
│   ├── pixel-map.js    # 书域地图
│   └── boss-records.js # Boss 战记录模块
├── css/
│   └── (后续拆分)
├── docs/
│   ├── CLAUDE.md
│   ├── DEV_LOG.md
│   ├── REQUIREMENTS.md
│   ├── TECH_STACK.md
│   ├── DESIGN.md
│   └── ROADMAP.md
└── data/
    └── (后续可能拆分)
```

## 响应式策略

- 手机（< 768px）：单列布局，加大字号
- 平板（768-1024px）：双列网格
- 桌面（> 1024px）：三列宽屏展示
