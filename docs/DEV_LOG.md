# 开发日志

> 每日记录开发事项、待完成、优化计划

---

## 2026-05-21

### 今日完成
- [x] 项目初始化：CLAUDE.md + 文档体系搭建
- [x] 设计文档定稿：数据架构、视觉风格、系统优化方案
- [x] Phase 1.1 核心代码：data.json + index.html + style.css
- [x] Phase 1.2: 七维雷达图（Canvas + 平滑动画）
- [x] Phase 1.3: 书域地图 / Boss 链 / 战历 / 书架模块
- [x] Phase 1.4: GitHub Pages 部署上线（shudao 仓库）
- [x] 粒子背景效果（particles.js）

### 解决问题
- data.json 中中文引号导致 JSON 解析失败，替换为「」
- git 身份配置（user.email / user.name）
- GitHub Pages 部署后浏览器缓存导致旧错误仍显示

---

## 2026-05-21（续）— v4 用户反馈迭代

**反馈 1：** "所有的显示的字什么的太小了，不好看。底太单调了。都用中文不要用英文。"

**反馈 2：** "大体可以，底太暗了，字体还可以再大点。还有这个书领域和能力的功能是不是重复了，我想要的是世界大地图那种感觉"

### v4 实现
- [x] 3D 世界大地图（Three.js CylinderGeometry）
- [x] OrbitControls 拖拽/缩放/自动旋转
- [x] 点击域弹出详情面板
- [x] 大幅提升字号 + 全中文界面
- [x] 粒子背景 + 扫描线 + 暗角 + 胶片颗粒

### 用户批评
- 开发文档没有随设计变更同步更新 → 已修复
- 工作流程中 skill 调用被跳过 → 已修复

---

## 2026-05-21（续续）— v5 设计变更

**反馈 3：** "好卡啊刚刚，越到后面越卡"

### v5 变更
- 能力维度 → 独立七维雷达图（Canvas 自绘）
- 地图 → 3D 地球仪（SphereGeometry + Canvas 贴图）
- 合并为单 RAF 循环（masterLoop）
- 粒子从 140 减至 80，每 3 帧更新一次

---

## 2026-05-21（续续续）— 背景地球仪雷达增强

- [x] "修真世界" → "书世界" 重命名
- [x] 背景增强：多色光晕、点阵纹理网格
- [x] 地球仪增强：不规则大陆、云层、双层大气辉光
- [x] 3D 雷达图替换 2D Canvas（Three.js + CSS2D 标签）

---

## 2026-05-21（续续续续续）— 原型合并

- [x] prototype.html → index.html 替换
- [x] 旧文件备份至 archive/

---

## 2026-05-21（续续续续续续）— 地球仪视觉增强

- [x] 海洋渲染、大陆架效果
- [x] 缩减陆地占比
- [x] 活跃域高亮（光冕环 + 辉光 + 脉冲光点）
- [x] hover 高亮（辉光精灵 + 文字提示）

---

## 2026-05-22 — v5.2 类真实星球改版

- [x] 程序化噪声地形 + 生物群落着色
- [x] 7 书域 Voronoi 覆盖层 + 域边界发光
- [x] 移除经纬网格线
- [x] 点击/hover 改为噪声陆地判定 + Voronoi 域检测
- [x] 删除弃用代码（手绘大陆相关）

---

## 2026-05-22 — 项目彻底清理

### 背景
项目经过多轮迭代，积累了大量冗余文件和过时文档，决定彻底重开。

### 清理内容
- [x] 删除 `.superpowers/`、`archive/`、`style.css`、`js/`、`docs/superpowers/` 等冗余文件
- [x] 简化 index.html CSS/JS 注释，保留完整功能
- [x] 精简 REQUIREMENTS.md 到核心需求
- [x] 更新 TECH_STACK.md 目录结构
- [x] 清空 DESIGN.md 待重新设计
- [x] 重写 ROADMAP.md 为当前状态

### 用户反馈
- 用户觉得项目太冗长，决定彻底重开，先清理再约设计方向

---

## 2026-05-22 — 彻底清空，从头开始

### 清理内容
- [x] `index.html` 替换为极简骨架（零 CSS、零 UI、零视觉代码，仅保留 data.json 加载验证 + Three.js importmap）
- [x] `docs/DESIGN.md`、`REQUIREMENTS.md`、`ROADMAP.md` 全部清空
- [x] `docs/TECH_STACK.md` 精简为仅保留选型表
- [x] `CLAUDE.md` 更新为清空状态
- [x] 验证骨架在浏览器能加载 data.json

### 当前状态
项目完全清空，进入 brainstorming 设计阶段。从核心设计理念和开发约定开始重新梳理。

### 待完成
- [ ] 走 brainstorming 流程：核心理念 → 需求 → 方案 → 模块设计 → spec
- [ ] 按设计实现前端
- [ ] 修习日历
- [ ] IMA 数据同步打通

---

## 2026-05-22 — 系统设计定稿

### 完成内容
- [x] 等级体系：60 级 6 境（开蒙→筑基→结丹→立言→化神→合道），60 个修仙+读书融合称号
- [x] XP 曲线：`XP(n) = round(200 × 1.08^(n-1) + 100)`，满级约 30 万 XP，3 年养成线
- [x] 七维能力：文/史/哲/政/世/心/器 七道，每道 10 段（未入门→此道通天）
- [x] 新书分类：主维+副维+难度 1-5 档
- [x] 维度成长公式：`维度点数 = 理解评分 × 3`
- [x] Boss 链：小怪（每次读书）→ 章 Boss（章节里程碑）→ 书 Boss（整本终极）
- [x] 复习触发：IMA DeepSeek 出题 → 答对 +10 XP → 连续 3 次铭刻
- [x] 修习统计：连续修习天数（加成倍率）+ 总修习天数（荣誉）
- [x] IMA DeepSeek 记录指令定稿（追加笔记格式）
- [x] 微信读书双源对接方案

### 技术对接
- [x] weread-skills 安装 + API Key 配置（wrk-xxx）
- [x] 微信读书 API 拉通验证：42 本书架、103 天修习
- [x] DESIGN.md / REQUIREMENTS.md / TECH_STACK.md / ROADMAP.md 全部更新

### 用户反馈
- 用户纠正：不是"连胜"是"连续修习"；先系统设计再页面；IMA 格式要完善
- 用户要求：Claude 主动思考完善而非被动确认
- 用户提出复习触发机制（融入 Boss 体系）

### 当前状态
系统设计定稿。data.json v2 Schema 已设计，待写入。

### 待完成
- [ ] data.json 按新 Schema 重构写入
- [ ] 页面可视化设计
- [ ] Claude 结算脚本
- [ ] 首次同步验证

---

## 2026-05-22（续1）— 全局漏洞梳理 + data.json v2 + API 摸查

### 全局漏洞梳理
- 列出 15 项漏洞，按阻断/重要/优化/待探索四级分类
- 阻断：data.json 未重构、weread-skills 能力未摸清、IMA 指令未验证
- 重要：结算脚本为零、数据流未跑通、IMA 解析容错、结算触发方式
- 优化/待探索：Git 安全、旧数据迁移、章 Boss 触发、原子性等

### data.json v2 Schema 设计
- [x] 8 区块定稿：schemaVersion / lastSync / player / dimensions / stats / bossHistory / bookShelf / knowledgePoints / rules
- [x] rules 集中管理：levelTable(60级) / dimensionTiers(10段) / streakBonuses / difficultyMultipliers
- [x] bookShelf 每本书加 domain + difficulty 字段
- [x] stats 补 totalSessions + totalReadingMinutes
- [x] RPG 隐喻映射：世界地图=7书域 / 副本=书 / 角色属性=七道值

### weread-skills API 能力摸查
- [x] 完整读取 SKILL.md + readdata.md + shelf.md + book.md + notes.md + review.md
- [x] 可直接获取：书架、进度(0-100)、累计时长(秒)、章节目录、阅读天数、分类偏好
- [x] 需推导：连续修习天数(dailyReadTimes反推)、阅读增量(存上次累计值算delta)
- [x] 没有：理解评分(IMA提供)、书域分类(Claude判定)

### IMA 指令部署验证
- [x] IMA 凭证确认（环境变量已配）
- [x] "书道"笔记本存在，3 篇笔记
- [x] 最新指令生成的笔记格式验证通过：6 字段完整，书域甚至更优（主/副维标注）
- [x] IMA → Claude 数据管道确认可用

### Git 状态清理
- [x] 3 commits：清理旧代码 → 文档更新 → 骨架替换
- [x] 仓库干净，仅剩 .superpowers/ 和 ref/ 未跟踪

### 用户反馈
- 用户要求使用 brainstorming skill 流程
- 用户选择 C：先梳理全局漏洞再分工
- IMA 指令部署验证：用户 10 分钟前部署，记的是 5/20 的读书记录

### 当前状态
漏洞清单 1-3 项已关闭。下一步：按新 Schema 重构 data.json。
