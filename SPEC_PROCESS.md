# SPEC_PROCESS.md — 规约与计划生成过程文档

> 本文档记录与 Superpowers 协作生成 SPEC.md 和 PLAN.md 的过程，包括 brainstorming 关键节点、决策记录、冷启动验证结果。

---

## 一、Brainstorming 过程

### 1.1 初始状态

项目方向来自上一轮对话（未启用 Superpowers）：**微缩模型涂装辅助工具**——面向战锤/高达/D&D 微缩模型玩家，解决"照抄教程偏色"和"自混代换翻车"两个核心痛点。

本轮对话启动时已启用 Superpowers 插件（v5.1.0），`using-superpowers` 技能在 session start 自动加载，`brainstorming` 技能按预期在识别到"确定项目方向"意图后介入。

**视觉伴侣**：启用了 Visual Companion（`localhost:49877`），在多轮设计中使用浏览器展示架构图、模块对比、设计选择。视觉伴侣在以下环节发挥了明显作用：
- 4 模块概览（project-overview.html）
- 架构设计讨论 + Open Design 纳入（architecture-v2.html）
- 数据模型设计（data-model.html）
- 混色引擎设计两轮迭代（mix-engine.html → mix-engine-v2.html，份数制改革）
- 3D 预览设计（3d-preview.html）
- Open Design 设计系统选择（open-design-choice.html）
- 最终方案总结（final-summary.html）

### 1.2 关键迭代轮次

#### 迭代 1：漆的透明度处理

**AI 追问**：涂料类型（Base/Layer/Shade/Wash/Glaze/Contrast）是否需要在录入时标记？不同透明度会影响混色算法精度。

**我的决策**：简化处理。除了 Shade 和 Contrast 之外，大部分漆本质上是不透明的。MVP 阶段所有漆统一按不透明处理，在 SPEC 风险项中注明此限制。

**影响**：混色引擎从"可能的 Kubelka-Munk 光谱模型"降级为 RGB 线性加权混合，大幅降低了 MVP 的算法复杂度。

---

#### 迭代 2：混色比例体系——从百分比到份数制

**我的修正**：PLAN 初稿中混色比例采用百分比步长（5% 步进），我提出实际操作中玩家不会用电子秤称量——而是按"滴"或"刷量"的整数份数混合。

**修订为"份数制"**：
- 每份 = 一滴漆 / 一刷量
- 份额：1/2/3/4 份整数
- 总计 ≤ 5 份（防止一次性混太多浪费）
- 双漆示例：1:1、1:2、2:1、1:3、3:1...
- 三漆示例：1:1:1、1:1:2、1:2:2...

**理由**：份数制直接映射到真实手操习惯，参考了实体色卡的呈现方式。百分比只是一种间接表示（20:80 = 两份红 + 八份白），用份数表达更直观。

---

#### 迭代 3："少量"标记机制——从人工预设到比例自动判定

**AI 建议**：在漆料库中预设某些漆为"极端色"（黑、白），计算时自动降权。

**我的修正**：极端色不应该人工预设，而是在计算结果中自然体现。比如计算得出 1:20:10 的配比，1 份的那瓶自动标记为"少量"。任何漆都可以成为"少量"——完全取决于实际搭配比例。

**最终设计**：当某漆份数 / 总份数 ≤ 1/10 时，显示"少量"而非数字。这是纯展示层面的处理，不修改底层算法。

---

#### 迭代 4：冰黄（Ice Yellow）的角色

**AI 追问**：冰黄——你之前提到用来调暖调的漆——算极端色还是普通漆？

**我的判断**：冰黄是普通漆。它是 AK 的常用漆，用于淡化颜色，不是微量添加物。分类应该由比例决定，不是颜色本身。

---

#### 迭代 5：3D 预览范围——材质球 vs 完整编辑器

**AI 确认**：MVP 阶段整个模型涂同一个颜色，不分区域上色；默认几何体 + STL 可选上传。

**我补充**：需要旋转、缩放、拖拽光源等交互功能——这些是查看控制，不是编辑。

**最终边界**：材质球预览器。不做分区域上色、不做环境贴图、不做照片级渲染。

---

### 1.3 AI 建议采纳与推翻

| 决策 | AI 建议 | 我的处理 | 结果 |
|------|---------|----------|------|
| 认证方式 | 邮箱 + 密码，避免短信费用 | **采纳** — 合理，学生项目零成本 | 写入 SPEC §3.1 |
| 前端设计系统 | Dashboard → **Discord**（修订） | **采纳后修订** — 用户重新审视 Open Design 界面后，改为 Discord 暗色调。理由：模型玩家社区以 Discord 为主要交流平台，暗调 UI 不抢夺 3D 工作区视觉焦点 | 写入 SPEC §8（已修订） |
| 文件存储 | 本地磁盘 + Docker volume | **采纳** — 学生项目够用 | 写入 SPEC §8 |
| Open Design skill | frontend-design + threejs + login-flow + platform-design | **采纳** — 覆盖全部模块 | 写入 SPEC §8 |
| 配方分享 | 先不做公开分享 | **采纳** — 个人项目无社区效果 | 写入 SPEC §3.5 |
| 百分比混色 | 5% 步长 | **推翻** — 改成份数制 | 混色引擎数据模型重设计 |
| 极端色预设 | 预设黑/白为极端色 | **推翻** — 改为比例自动判定 | "少量"标记逻辑改为展示层 |
| 混色预警 | 计算时自动检测"发灰" | **推翻** — 暂时不做，用户肉眼判断 | 不实现预警功能 |

### 1.4 反思：Brainstorming 技能评价

**做得好的地方：**

1. **一问一答的节奏感好**。每次只问一个问题，不会信息过载。这在"AI 追问 → 我思考 → AI 修订方案"的反馈循环中非常高效。
2. **先限定范围再细化**。比如先确认"你到底是不是玩家"（用户画像），再追问"你最近一次涂装流程"（痛点挖掘），最后才到"混色比例是百分比还是份数"（实现细节）。这种从粗到细的递进避免了过早陷入技术细节。
3. **视觉伴侣在特定场景有价值**。架构图、模块对比、数据模型关系图用 HTML 呈现确实比纯文本更直观。但设计系统选择这类只需要看名字+描述的决策，浏览器的增值有限。
4. **"做一个/不做什么"的双向边界**。每个模块都明确了 MVP 边界（如 3D 预览做材质球不做分区域上色），这为 plan 的 scope 管理打下了好基础。

**不满的地方：**

1. **对领域知识的依赖**。Brainstorming 在追问时会基于常识推断，但在微缩模型涂装这个垂直领域，它不知道 BSL/NMM/TMM/glazing 等技法术语。我需要补充解释。好的一面是它会诚恳追问而非假装理解。
2. **冷启动问题未被及时发现**。Brainstorming 产出的 SPEC 中没有指定 Maven 是 wrapper 还是 system。这个问题在 PLAN 中也没有——直到冷启动验证时被 codex 抓出来。这说明 brainstorming 阶段缺乏对"构建工具链细节"的追问，更多聚焦在业务逻辑上。
3. **Open Design 设计系统选择的决策过程有点随意**。我选了 Dashboard 是因为 AI 说它"天然适配多面板布局"，但我实际上没有横向对比其他系统的视觉截图。这个选择本质上是基于文字描述而非视觉证据做出的。

---

## 二、冷启动验证

### 2.1 验证环境

| 项目 | 详情 |
|------|------|
| **验证 agent** | GPT-5.2-Codex（类型不同于主开发 agent Claude Code） |
| **验证 task** | Task 0.1：Spring Boot 项目脚手架 |
| **输入** | 仅 SPEC.md + PLAN.md，不提供额外口头解释 |
| **时间消耗** | 试跑约 15 分钟 |

### 2.2 Agent 表现

**顺利完成的步骤：**

- 创建 `backend/pom.xml` — 正确，依赖完整
- 创建 `MiniPaintApplication.java` — 正确
- 创建 `application.yml` — 正确
- 创建 `application-dev.yml` — 正确
- 创建 `MiniPaintApplicationTests.java` — 正确

**停下的地方：**

在 Step 6（验证构建）时，agent 停止了执行，提出：

> 「PLAN 的 Step 6 要求运行 `./mvnw`，但任务 0.1 没有说明要生成 Maven Wrapper 文件。可能的解释有：方案 A：后续 Task 会补充 mvnw 和 .mvn/；方案 B：这里也需要我一并生成；方案 C：项目统一使用系统 Maven。请确认选项后我再继续。」

### 2.3 暴露的 SPEC/PLAN 缺陷

**问题**：PLAN Task 0.1 的 Step 6 指定了 `./mvnw` 作为构建命令，但 Task 0.1 的文件清单中没有包含 Maven Wrapper 文件（`mvnw`、`mvnw.cmd`、`.mvn/wrapper/maven-wrapper.properties`）的生成步骤。

**根因**：SPEC §8 的技术选型表中写了"Maven"作为构建工具，但没有区分"Maven Wrapper（内嵌）"与"系统 Maven"。PLAN 在编写时默认使用了 `./mvnw`，但未在 scaffolding 步骤中包含其初始化。

**严重程度**：低 — 有明确的替代方案（系统 Maven），不影响核心逻辑。但这是"文档完整性"问题的典型例子。

### 2.4 修订内容

**PLAN.md**：全文替换 `./mvnw` → `mvn`（共 14 处）。系统已安装 Maven 3.x，无需 Wrapper。

### 2.5 修订 Diff（关键摘要）

```diff
diff --git a/PLAN.md b/PLAN.md

# Task 0.1 验证命令
-Run: `cd backend && ./mvnw test -Dtest=MiniPaintApplicationTests`
+Run: `cd backend && mvn test -Dtest=MiniPaintApplicationTests`

# Dockerfile.backend 构建
-RUN ./mvnw dependency:resolve
+RUN mvn dependency:resolve
-RUN ./mvnw package -DskipTests
+RUN mvn package -DskipTests

# Makefile
-	cd backend && ./mvnw test -Dspring.profiles.active=dev
+	cd backend && mvn test -Dspring.profiles.active=dev

# README 开发指引
-cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
+cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev

# ... 共 14 处替换, 完整 diff 见 commit 2742ba3
```

**修订 commit:** `2742ba3` — "fix: replace ./mvnw with mvn throughout PLAN.md"

### 2.6 冷启动验证反思

1. **PLAN 颗粒度对 agent 行为的影响**：Task 0.1 有 7 个 step，每个 step 都有具体代码。Agent 能够无障碍地执行第 1-5 步，在第 6 步（运行命令）停下。这说明 PLAN 的"代码"部分足够清晰，但"环境假设"部分有隐性依赖。

2. **不同 agent 的行为差异**：GPT-5.2-Codex 的表现是"停下提问"而非"默默修复"。如果换成某些更激进的 agent（如自动生成 mvnw 文件），可能就会直接跳过不吱声——那就不会暴露这个 spec 缺陷了。选择"爱提问"的 agent 做冷启动验证可能更有价值。

3. **冷启动验证的成本收益**：投入 15 分钟发现了 1 个确实需要修复的问题。如果项目更大、spec 页数更多，冷启动验证的价值会指数级上升。小项目里至少能抓到 1-2 个盲点。

---

## 三、后续流程状态

| 步骤 | 技能 | 状态 |
|------|------|------|
| brainstorming | `superpowers:brainstorming` | 完成 |
| writing-plans | `superpowers:writing-plans` | 完成 |
| 冷启动验证 | — | 完成（修订已应用到 PLAN.md） |
| using-git-worktrees | `superpowers:using-git-worktrees` | 完成（11 个 worktree, 11 个 PR） |
| subagent-driven-development | `superpowers:subagent-driven-development` | 完成（10 次 subagent dispatch） |
| test-driven-development | `superpowers:test-driven-development` | 完成（每个 task 红-绿-commit） |
| requesting-code-review | `superpowers:requesting-code-review` | 完成（inline spec + code quality 每 task） |
| finishing-a-development-branch | `superpowers:finishing-a-development-branch` | 完成（11 个 PR 全部 merged） |
| AGENT_LOG.md | — | 已创建（含全阶段记录） |
| REFLECTION.md | — | 待撰写 |
