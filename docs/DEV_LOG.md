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

---

## 2026-05-22（续2）— 会话延续 + 文档修复

### 背景
会话被 compact 后延续。用户指出文档更新滞后问题，需要主动驱动而非等提醒。

### 修复内容
- [x] REQUIREDMENTS.md：data.json 数据模型状态从"待重构" → "v2 已重构 ✅"
- [x] ROADMAP.md：Phase 3 去掉已完成的 data.json 重构和 GitHub Pages 部署
- [x] feedback memory 强化：从"知道规则"改为"主动驱动清单"

### 当前状态
data.json v2 重构完毕，3 个阻断漏洞关闭。待用户确认推进方向（推荐：推 origin → Phase 2 页面设计）。

### 待完成
- [ ] 推 origin（5 commits ahead）
- [ ] Phase 2 页面可视化设计

---

## 2026-05-22 — 前端可视化初版实现

### 完成内容
- [x] brainstorming 流程：视觉方向确定 → 布局设计 → 配色定稿
- [x] VISUAL_DESIGN.md：完整前端视觉设计文档
- [x] 前端工程搭建：模块化 JS（app.js/panels.js/radar.js/map.js）+ CSS
- [x] 六大模块：
  - 顶部状态栏（境界/称号/书道标题/修习统计）
  - 人物面板（头像/道号/修为条）
  - 灵根雷达图（SVG 七边形）
  - 书域山河图（CSS 风格化地图）
  - 副本战历（空状态引导）
  - 感悟道藏 + 修习统计
- [x] 删除 data_old_backup.json 遗留文件
- [x] 删除 Three.js importmap（不再需要）

### 视觉规范
- 墨褐底色 `#141210` → `#2a241e`，金色点缀 `#c9a96e`
- 三栏布局：240px + 1fr + 220px
- 七维各自独立配色

### 待完成
- [ ] 灵根列表点击 → 雷达图高亮联动
- [ ] 书籍数据填充后地图展示标记
- [ ] Boss 战历数据渲染
- [ ] 手机端竖屏适配
- [ ] 推 origin

---

## 2026-05-22（续3）— 全屏水墨画卷重构

### 背景
初始 v1 三栏布局经用户反馈后重新设计方向。

### 设计迭代
- [x] **frontend-design skill 调用**：重新走设计思考流程
- [x] **方向确认**：用户在三个方向中选择「水墨卷轴·纵向流动」
- [x] **首版实现**：960px 居中窄卷轴 + 山峦分割线 + 卷轴杆
- [x] **用户反馈**：画卷仙侠风不够，要全屏横铺
- [x] **终版实现**：全屏铺满 + 六层水墨远山背景 + 半透明浮动面板 + SVG 水墨地图 + 雷达辉光

### 完成内容
- [x] 全屏画卷布局（取代三栏栅格和窄卷轴）
- [x] 六层远山 SVG（淡墨→浓墨）+ 三层雾霭 + 绢本 grain
- [x] 飞鸟墨点点缀
- [x] 半透明面板（backdrop-filter）浮于画面上
- [x] 人物/灵根/雷达/地图/副本/感悟/统计 七模块适配
- [x] 入场动画（面板交错 fade-in）
- [x] 颜色提亮暖化

### 当前状态
视觉方向已定("先这样")。待决定下一步方向：交互迭代 / 数据管道 / 推 origin。

---

## 2026-05-22 — Phase 4 结算管道打通

### 背景
核心循环"读→聊→结算→可视化"卡在结算环节，data.json 全是零，前端无法展示真实数据。

### Phase 4.1：结算计算引擎
- [x] `scripts/settle.js` — 纯 Node.js 计算引擎，不做 API 调用
- [x] 核心函数：parseNote / calcStreak / matchBook / detectBosses / calcLevel / getTierName
- [x] 幂等设计：processedNoteIds 防重复处理，每本书 lastKnownProgress 增量 Boss 检测
- [x] 支持 --dry-run 预览模式
- [x] 冒烟测试通过（4 组：正常结算 / 幂等跳过 / 章 Boss / 书 Boss 完成）

### Phase 4.2：操作手册 + 文档
- [x] `docs/SETTLEMENT.md` — 8 步结算操作手册
- [x] `CLAUDE.md` — 注册"同步书道"命令
- [x] `data.json` — 添加 processedNoteIds 字段
- [x] `REQUIREMENTS.md` — 结算引擎标记已完成
- [x] `ROADMAP.md` — Phase 4 状态推进

### Phase 4.3：首次真实同步
- [x] 拉取微信读书数据：43 本藏书、103 天总修习、2026 年唯一在读《中国历代政治得失》
- [x] 拉取 IMA 笔记：1 条标准格式笔记（理解评分 7，政道主/史道副）
- [x] 发现 IMA 笔记为无换行单行格式，增强 parseNote 兼容性
- [x] settle.js 计算：50 XP、史道+21、政道+6、小怪×1、章Boss×1
- [x] data.json 写入非零数据：第 1 次结算成功
- [x] 幂等性验证通过：二次运行 0 条处理

### 关键技术决策
- **笔记格式兼容**：IMA 追加的笔记可能是单行无换行格式，解析器不能依赖换行符
- **Boss 触发**：用 lastKnownChapterUid 增量检测章 Boss，用 progress 0→100 检测书 Boss
- **连击计算**：0 秒阅读日不计入连续天数，确保 streak 反映真实阅读行为
- **双 bookId**：中国历代政治得失有两个版本（EPUB + PDF），书名匹配取第一个

### 当前状态
闭环已通！data.json 有真实数据，网页可展示。
结算管道随时可执行：`node scripts/settle.js < session_data.json`

### 待完成
- [ ] 灵根列表点击 → 雷达图联动高亮
- [ ] 地图书籍标记
- [ ] 手机竖屏适配

---

## 2026-05-22 — Boss 战历渲染 + 灵根进度条

### 完成内容
- [x] settle.js 写入 bossHistory：每次结算自动将 Boss 击杀记入战历
- [x] data.json 补齐首次结算的 2 条 Boss 战历（小怪 + 章Boss）
- [x] renderDungeon 数据渲染分支：Boss 列表按时间倒序，类型图标 + 书名 + XP
- [x] renderDimList 进度条：每条灵根显示当前点数/下一段位门槛 + 进度条
- [x] CSS Boss 战历样式 + 灵根进度条样式

### 当前状态
Phase 3 "Boss 战历数据渲染"完成。灵根列表可区分 21 点和 0 点的进度差异。

---

## 2026-05-22 — 全局代码审计 + P0 Bug 修复

### 审计背景
用户要求全面检查项目漏洞、代码质量、优化方向。使用 Explore agent 进行了全文件代码审查。

### Bug 修复
- [x] **雷达图 7 轴线修复**：`radar.js:52` 原来只画 3 条对边连线（`[0,1,2]`），改为从中心到 7 个顶点的全部轴线
- [x] **最长连续天数修复**：data.json 新增 `longestStreak` 字段，settle.js 用 `Math.max()` 追踪历史最大值，panels.js "最长连续"行改为读取 `longestStreak`
- [x] **streakBonuses 单源化**：删除 settle.js 的 `STREAK_TIERS` 重复常量，`getStreakMult()` 改为从 `data.json.rules.streakBonuses` 读取，消除数据不一致隐患

### 代码清理
- [x] 角色名为空时显示 "?" 而非 "undefined"（panels.js）
- [x] 删除 `calcStreak` 中未使用的 `today` 变量（settle.js）
- [x] 删除 `renderMap` 中未使用的 `rules` 参数及调用方传参（map.js + app.js）

### 审计发现的完整漏洞清单
见 plan 文件（`C:\Users\qinmi\.claude\plans\agile-wondering-ember.md`），共 18 项，按 High/Medium/Low 分级。

### 待修复（未在当前会话处理）
- Medium: app.js 数据校验、innerHTML XSS 防护、Firefox 滚动条兼容
- Phase 3 待迭代：灵根点击→雷达联动、地图书籍标记、手机竖屏适配
- Phase 5：修习日历

---

## 2026-05-22 — 交互增强 + 代码健壮性

### 完成内容
- [x] **灵根列表 → 雷达图联动高亮**：点击灵根条目，雷达图对应顶点亮起。radar.js 新增 `highlightDim()`，panels.js 添加 `data-dim` 属性，app.js 做事件中介。toggle 逻辑（点同一条目取消）
- [x] **地图书籍标记**：按 `bookShelf.reading/completed[].mainDim` 统计各域书籍数，在 SVG 地图 domain label 下方显示圆点 + 计数
- [x] **XSS 防护**：panels.js 新增 `esc()` 函数转义 HTML 特殊字符，包裹 player.name 和 b.bookTitle
- [x] **Firefox 滚动条兼容**：CSS 添加 `* { scrollbar-width: thin; scrollbar-color: ... }`
- [x] **fetch 超时保护**：app.js 10s AbortController，网络慢不会永久挂起
- [x] **NaN 保护**：Boss 排序 `new Date().getTime() || 0` 防止无效 timestamp 产生 NaN 排序
- [x] **去除死样式**：删除 `#loading` CSS 选择器（页面无对应元素）

### 修改文件
- [js/radar.js](js/radar.js) — data-dim 属性 + highlightDim 导出
- [js/panels.js](js/panels.js) — esc 函数 + data-dim 属性 + timestamp NaN 保护
- [js/app.js](js/app.js) — import highlightDim + 点击事件中介 + fetch 超时
- [js/map.js](js/map.js) — 按 mainDim 统计书籍 + SVG 标记渲染
- [css/style.css](css/style.css) — .dim-item.active + Firefox 滚动条 + 移除 #loading
- [docs/ROADMAP.md](docs/ROADMAP.md) — 更新完成状态
- [docs/DEV_LOG.md](docs/DEV_LOG.md) — 本次记录
