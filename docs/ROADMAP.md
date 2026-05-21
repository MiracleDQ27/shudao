# 执行路线图

> 分阶段开发计划，每阶段完成后验证再继续

## Phase 1：基础面板上线

**目标：** 像素风面板能打开、能看到数据。部署到 GitHub Pages，手机可访问。

| 步骤 | 内容 | 预计 |
|------|------|------|
| 1.1 | 创建 data.json（初始数据）+ index.html 骨架 | 本次 |
| 1.2 | style.css 像素风全局样式 | 本次 |
| 1.3 | main.js 数据加载 + 角色信息渲染 | 本次 |
| 1.4 | radar-chart.js 七维雷达图 | 下次 |
| 1.5 | pixel-map.js 书域地图 | 下次 |
| 1.6 | boss-records.js Boss战记录模块 | 下次 |
| 1.7 | GitHub Pages 部署 | 下次 |

**验证标准：** 浏览器打开 index.html 能看到完整面板，手机访问正常

---

## Phase 2：数据同步打通

**目标：** "同步面板"指令能拉 IMA 数据、更新 data.json、推送 GitHub。

| 步骤 | 内容 |
|------|------|
| 2.1 | 产出 IMA DeepSeek 指令文档 |
| 2.2 | 实现读取 IMA API → 解析笔记 → 生成 data.json |
| 2.3 | 打通"同步面板"指令流程 |
| 2.4 | Boss战记录模块联调 |

---

## Phase 3：功能完善

**目标：** 粒子效果、修习日历、动画打磨。

| 步骤 | 内容 |
|------|------|
| 3.1 | 粒子效果背景 |
| 3.2 | 修习日历（月度贡献图） |
| 3.3 | 书架全景交互 |
| 3.4 | 动画打磨 + 响应式优化 |

---

## Skill 调用顺序

```
Phase 1 编码 → vibe-learning-cn
Phase 1 前端确认 → frontend-design（如需）
Phase 1 结束 → simplify（代码review）+ verification-before-completion
Phase 2 → ima-skill
各阶段结束 → requesting-code-review
出bug → systematic-debugging
```
