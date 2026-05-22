# SPEC: 微缩模型涂装辅助工具 (Miniature Painting Assistant)

> 版本: 1.0 | 日期: 2026-05-22 | 状态: 已确认

---

## 1. 问题陈述 (Problem Statement)

### 1.1 要解决的问题

微缩模型涂装玩家（战锤/高达/D&D）面临两个核心痛点：

1. **照抄教程也偏色**：视频/照片中的漆色受拍摄灯光、底色影响，与实际肉眼观感存在偏差。按教程买了同款漆，涂完发现颜色完全不对。
2. **自混代换翻车**：不想为某个颜色买一瓶新漆，试图用手头已有漆混色替代。非美术背景玩家凭感觉混色，比例不可复现、容易"发灰"。

### 1.2 目标用户

- 微缩模型涂装爱好者（战锤 Warhammer / 高达 Gunpla / D&D / 其他桌游微缩模型）
- 有一定涂装经验、希望进阶的业余玩家
- 追求 NMM（非金属金属质感）等高阶技法的玩家
- **非美术专业背景**，对色彩理论和光影直觉缺乏系统训练

### 1.3 为什么值得做

市面上没有面向微缩模型玩家的混色辅助工具。现有方案要么是 Photoshop 级别（贵、难上手），要么是靠眼睛猜（不准）。一个免费的、针对微缩模型涂装工作流优化的 Web 工具，有真实的社区需求。

### 1.4 30 秒电梯演讲

> 微缩模型涂装爱好者经常花几百块买漆，涂完才发现配色不搭或光泽度不对。这个工具让你录入手头的漆、取目标色、计算混色方案，在浏览器里就能预览不同光照和反射率下的涂装效果——不用浪费一滴漆。

---

## 2. 用户故事 (User Stories)

| # | 角色 | 需求 | 价值 | INVEST |
|---|------|------|------|--------|
| US-1 | 玩家 | 注册账号并登录，管理我的漆料库 | 漆料库是混色引擎的数据基础 | I/N/E/V/T |
| US-2 | 玩家 | 拍照录入每瓶漆的品牌、色号和真实 RGB | 消除"卖家秀"色差，建立个人色彩空间 | I/N/E/V/T |
| US-3 | 玩家 | 从任意图片取目标色，用我库中的漆计算混色方案 | 不买新漆也能调出想要的颜色 | I/N/E/V/T |
| US-4 | 玩家 | 在 3D 材质球上预览颜色在不同光源和粗糙度下的效果 | 非美术生也能培养光影直觉 | I/N/E/V/T |
| US-5 | 玩家 | 上传 STL 文件，以真实模型几何体进行光影预览 | 不同模型形状的光影表现差异很大 | I/N/E/V/T |
| US-6 | 玩家 | 保存混色配方，随时回看 | 下次涂装不用重新计算 | I/N/E/V/T |
| US-7 | 玩家 | 使用色轮工具查看互补色、三角色等配色建议 | 有一定美术理论的用户可获得配色灵感 | I/N/E/V/T |

---

## 3. 功能规约 (Functional Specification)

### 3.1 账户系统

| 项目 | 描述 |
|------|------|
| 注册 | 邮箱 + 密码 + 昵称；后端发送验证邮件（含激活链接）；激活后账号可用 |
| 登录 | 邮箱 + 密码；Spring Security session-based |
| 忘记密码 | 输入邮箱 → 发送重置链接 → 新密码设置 |
| 输入 | email: string, password: string (≥8 chars), nickname: string (≤20 chars) |
| 输出 | JWT / session cookie；验证邮件 |
| 错误处理 | 邮箱已注册 → 400；邮箱格式不合法 → 400；密码过短 → 400；未激活登录 → 401；激活链接过期 → 410 |
| 边界条件 | 邮箱唯一；密码 bcrypt 哈希存储；验证 token 24h 过期 |

### 3.2 漆料库 (Paint Library)

| 项目 | 描述 |
|------|------|
| CRUD | 创建：品牌 + 色号 + RGB + 照片(可选) + 备注(可选)；查看：列表 + 搜索 + 按品牌筛选；编辑：所有字段可修改；删除：确认后软删除 |
| 取色 | 用户上传平涂照片 → 点击取色点 → 自动提取 RGB（前端 Canvas API 实现） |
| 品牌 | 枚举: Games Workshop (GW) / Vallejo (AV) / AK Interactive / Green Stuff World (GSW) / Scale75 / Other。允许自定义文本 |
| 输入 | brand: enum\|string, color_name: string, r/g/b: int (0-255), photo: file(≤5MB, jpg/png), notes: string(≤500) |
| 输出 | paint_id, 完整漆信息 JSON |
| 错误处理 | RGB 超出 0-255 → 400；必填字段缺失 → 400；未登录 → 401 |

### 3.3 混色引擎 (Mixing Engine)

| 项目 | 描述 |
|------|------|
| 取目标色 | ① 上传/粘贴图片 → 点选取色 → RGB；② 色轮手动选色 → RGB；③ 3D 预览取色暂存 → RGB；④ 直接输入 HEX/RGB |
| 混色计算 | 输入：目标 RGB + 用户漆料库 → 遍历 ≤3 种漆的组合（整数份数 1~4，总和 ≤5）→ 按 ΔE 升序排列 → 返回 TOP-10 候选 |
| 三原色参考 | 始终输出一份 CMY 减法混色的标准方案作为参考基线 |
| "少量"标记 | 当某漆份数 / 总份数 ≤ 1/10 时，自动标记为"少量"而非数字 |
| 输出 | 候选列表 (color_name + ratio + preview_hex + delta_e)；三原色参考方案 |
| 边界条件 | 漆料库 < 2 瓶 → 无法计算库漆方案，仅输出三原色方案 |
| 算法 | RGB 线性加权；ΔE = CIE76 欧几里得距离（√((ΔR²+ΔG²+ΔB²))）；暴力枚举所有 ≤3-paint ≤5-total-parts 组合 |
| 已知局限 | 所有漆按不透明处理；RGB 空间混色精度有限（见 §9） |

### 3.4 3D 光影预览 (3D Preview)

| 项目 | 描述 |
|------|------|
| 默认几何体 | 球体 / 立方体 / 圆柱体（经典材质球三件套） |
| STL 上传 | Three.js STLLoader；文件上限 50MB；自动居中 + 自适应缩放 |
| 颜色 | 从混色结果传入 / 手动取色器 / 漆库选色 |
| Roughness | 滑块 0.0 (光泽/Gloss) ~ 1.0 (消光/Matte) |
| Metalness | 滑块 0.0 (非金属/non-metallic) ~ 1.0 (金属/metallic) |
| 光源 | 1~3 个点光源可开关；拖拽调整位置(球坐标 θ/φ)；预设角度（顶光/侧光/底光）；色温滑块 2700K~6500K |
| 交互 | OrbitControls: 旋转(左键拖拽)、缩放(滚轮)、平移(右键拖拽)；光源: DragControls 拖拽 |
| 取色暂存 | 点击模型表面亮部/暗部 → 取像素 RGB → "发送到混色引擎"按钮 |
| 错误处理 | STL > 50MB → 400；非 STL 格式 → 400；Three.js 渲染失败 → 降级提示 |

### 3.5 配方管理 (Recipe)

| 项目 | 描述 |
|------|------|
| CRUD | 保存：从混色结果 → 命名 + 描述(可选) → 入库；查看列表；删除 |
| 结构 | 配方名 + 描述 + 目标色 RGB + 目标图片(可选) + 成分列表 (paint_id + ratio) |
| 可见性 | 仅私有（MVP 不做分享） |

### 3.6 色轮辅助工具 (Color Wheel)

| 项目 | 描述 |
|------|------|
| 标准色轮 | 360° HSV 色环 Canvas 渲染，点击取色 |
| 互补色 | 自动计算对位 180° 颜色 |
| 三角色 | 自动计算 120° 三角配色 |
| 类比色 | 相邻 ±30° 颜色 |
| 发送混色 | 选中任意颜色 → "作为目标色发送到混色引擎" → 跳转混色模块 |

---

## 4. 非功能性需求 (Non-functional Requirements)

| 类别 | 要求 |
|------|------|
| 性能 | 混色计算（500 瓶漆以内）< 2s；3D 预览帧率 ≥ 30fps（STL ≤ 50k 面） |
| 安全 | 密码 bcrypt 哈希；邮箱验证激活；会话过期机制；文件上传大小/类型校验 |
| 可用性 | 响应式布局（桌面优先，≥1280px 最佳）；色盲友好的色差标注；无鼠标时键盘可操作 |
| 可观测性 | Spring Boot Actuator `/health` + `/metrics`；Docker 容器 healthcheck |
| 兼容性 | Chrome/Firefox/Edge 最新版；Three.js WebGL 2.0 支持 |

---

## 5. 系统架构 (System Architecture)

```
┌──────────────────────────────────────────────────────────┐
│                   Web 前端 (React 18 + TypeScript)        │
│    Open Design: Discord 设计系统 + frontend-design      │
│                 + threejs + login-flow + platform-design   │
├──────────────┬───────────────┬──────────────┬─────────────┤
│  漆料库 UI    │  混色引擎 UI   │  3D 预览 UI  │  账户/配方   │
├──────────────┴───────────────┴──────────────┴─────────────┤
│                REST API (Spring Boot 3 + Java 17)          │
├──────────────┬───────────────┬──────────────┬─────────────┤
│  /api/auth   │  /api/paints  │   /api/mix   │ /api/recipes│
│  /api/models │  /api/health  │              │             │
├──────────────┴───────────────┴──────────────┴─────────────┤
│                    PostgreSQL 16                           │
│  users │ paints │ recipes │ recipe_components │ models     │
└──────────────────────────────────────────────────────────┘
```

**数据流:**
1. 用户拍照 → 取色 → 漆料库 CRUD
2. 图片/色轮/3D 取色 → 混色引擎输入
3. 混色引擎 → 三原色方案 + 库漆候选(ΔE 排序)
4. 混色结果 → 可选保存为配方
5. 颜色 → 3D 材质球 (color + roughness + metalness + light)
6. 3D 取色暂存 → 回传混色引擎（闭环）

---

## 6. 数据模型 (Data Model)

```
User
  id              BIGSERIAL PK
  email           VARCHAR(255) UNIQUE NOT NULL
  password_hash   VARCHAR(255) NOT NULL
  nickname        VARCHAR(20) NOT NULL
  email_verified  BOOLEAN DEFAULT FALSE
  role            VARCHAR(20) DEFAULT 'USER'  -- USER | ADMIN
  created_at      TIMESTAMP DEFAULT NOW()

VerificationToken
  id              BIGSERIAL PK
  user_id         BIGINT FK → User
  token           VARCHAR(255) UNIQUE NOT NULL
  type            VARCHAR(20) NOT NULL  -- EMAIL_VERIFY | PASSWORD_RESET
  expires_at      TIMESTAMP NOT NULL
  created_at      TIMESTAMP DEFAULT NOW()

Paint
  id              BIGSERIAL PK
  user_id         BIGINT FK → User NOT NULL
  brand           VARCHAR(50) NOT NULL  -- GW | AV | AK | GSW | Scale75 | Other
  brand_other     VARCHAR(100)  -- custom brand name if brand = 'Other'
  color_name      VARCHAR(100) NOT NULL
  color_code      VARCHAR(30)  -- 厂家原色号
  r               INT NOT NULL (0-255)
  g               INT NOT NULL (0-255)
  b               INT NOT NULL (0-255)
  image_url       VARCHAR(500)  -- 平涂照片路径
  notes           VARCHAR(500)
  is_deleted      BOOLEAN DEFAULT FALSE
  created_at      TIMESTAMP DEFAULT NOW()

Recipe
  id              BIGSERIAL PK
  user_id         BIGINT FK → User NOT NULL
  name            VARCHAR(100) NOT NULL
  description     VARCHAR(500)
  target_r        INT (0-255)
  target_g        INT (0-255)
  target_b        INT (0-255)
  target_image_url VARCHAR(500)
  created_at      TIMESTAMP DEFAULT NOW()

RecipeComponent
  id              BIGSERIAL PK
  recipe_id       BIGINT FK → Recipe NOT NULL
  paint_id        BIGINT FK → Paint NOT NULL
  ratio           INT NOT NULL (1-4)  -- 份数
  is_tricolor     BOOLEAN DEFAULT FALSE  -- 是否属于三原色方案

SavedModel
  id              BIGSERIAL PK
  user_id         BIGINT FK → User NOT NULL
  filename        VARCHAR(255) NOT NULL
  file_path       VARCHAR(500) NOT NULL
  uploaded_at     TIMESTAMP DEFAULT NOW()

UserSettings
  id              BIGSERIAL PK
  user_id         BIGINT FK → User UNIQUE NOT NULL
  default_roughness   DOUBLE PRECISION DEFAULT 0.5
  default_metalness   DOUBLE PRECISION DEFAULT 0.0
  default_light_count INT DEFAULT 1
  default_light_pos_x DOUBLE PRECISION DEFAULT 0.0
  default_light_pos_y DOUBLE PRECISION DEFAULT 5.0
  default_light_pos_z DOUBLE PRECISION DEFAULT 5.0
```

---

## 7. API 设计 (API Design)

### 7.1 认证 `/api/auth`

| 方法 | 路径 | 说明 | 请求体 | 响应 |
|------|------|------|--------|------|
| POST | `/api/auth/register` | 注册 | `{email, password, nickname}` | `{message, userId}` → 发送验证邮件 |
| GET | `/api/auth/verify-email` | 验证邮箱 | `?token=xxx` | `{message}` → 激活成功 |
| POST | `/api/auth/login` | 登录 | `{email, password}` | `{token, user{nickname}}` |
| POST | `/api/auth/forgot-password` | 忘记密码 | `{email}` | `{message}` → 发送重置邮件 |
| POST | `/api/auth/reset-password` | 重置密码 | `{token, newPassword}` | `{message}` |
| POST | `/api/auth/logout` | 登出 | — | `{message}` |

**错误码:** 400 (参数不合法), 401 (认证失败), 409 (邮箱已注册), 410 (token 过期)

### 7.2 漆料 `/api/paints`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/api/paints` | 列表(支持 ?brand=&search=) | ✓ |
| GET | `/api/paints/{id}` | 详情 | ✓ |
| POST | `/api/paints` | 创建 | ✓ |
| PUT | `/api/paints/{id}` | 更新 | ✓ |
| DELETE | `/api/paints/{id}` | 软删除 | ✓ |

### 7.3 混色 `/api/mix`

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/mix` | 计算混色方案 |

请求体: `{targetR, targetG, targetB, maxPaints: 3}`

响应: `{tricolor: {cyan, magenta, yellow, white, ratios[]}, candidates: [{paints: [{id, name, ratio, isTraceAmount}], mixedR, mixedG, mixedB, deltaE, previewHex}]}` (TOP-10)

### 7.4 配方 `/api/recipes`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/api/recipes` | 列表 | ✓ |
| GET | `/api/recipes/{id}` | 详情(含成分) | ✓ |
| POST | `/api/recipes` | 保存 | ✓ |
| DELETE | `/api/recipes/{id}` | 删除 | ✓ |

### 7.5 模型文件 `/api/models`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/api/models` | 已上传列表 | ✓ |
| POST | `/api/models` | 上传 STL (multipart) | ✓ |
| DELETE | `/api/models/{id}` | 删除 | ✓ |

### 7.6 用户设置 `/api/settings`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/api/settings` | 获取设置 | ✓ |
| PUT | `/api/settings` | 更新设置 | ✓ |

---

## 8. 技术选型与理由 (Technology Choices)

| 层 | 选型 | 版本 | 理由 |
|----|------|------|------|
| 后端框架 | Spring Boot | 3.x | 开发者最熟悉的框架；分层架构清晰，适合模块化开发；Spring Security 开箱即用 |
| 语言 | Java | 17+ | LTS 版本，生态成熟；Record/Stream API 提升代码可读性 |
| 前端框架 | React + TypeScript | 18+ | 生态最成熟；Three.js (@react-three/fiber) 集成最方便 |
| 3D 引擎 | Three.js | latest | STL 加载、MeshStandardMaterial (roughness/metalness)、OrbitControls 全部就绪 |
| 前端设计 | **Open Design** | — | **作业强制要求** |
| 设计系统 | Discord | — | 暗色 UI 契合模型玩家社区氛围（Discord 为主要交流平台），暗调背景不抢夺 3D 工作区的视觉焦点 |
| Skills | frontend-design, threejs, login-flow, platform-design | — | 分别覆盖通用 UI、3D 场景、认证流程、平台工具型界面 |
| 数据库 | PostgreSQL | 16 | 结构化数据 + JSONB 灵活字段；Spring Data JPA 无缝集成 |
| 认证 | Spring Security + JavaMail | — | 邮箱验证免外部服务费用；bcrypt 密码哈希 |
| 文件存储 | 本地磁盘 + Docker volume | — | 学生项目零成本；漆色照片 + STL 文件体量不大 |
| 容器化 | Docker + docker-compose | — | 作业 §4.10 强制要求；一键启动前后端 + 数据库 |
| CI | GitHub Actions | — | 作业 §4.8 强制要求；自动测试 + Docker 镜像构建 |
| 测试 | JUnit 5 + Mockito (后端); Vitest (前端) | — | TDD 强制要求 |

---

## 9. 验收标准 (Acceptance Criteria)

| # | 模块 | 验收标准 |
|---|------|----------|
| AC-1 | 账户 | 注册 → 收邮件 → 点击激活 → 登录成功。忘记密码 → 收重置邮件 → 设置新密码 → 可登录。 |
| AC-2 | 漆料 | 可录入/查看/编辑/删除漆。拍照取色可提取 RGB。品牌筛选可用。 |
| AC-3 | 混色 | 取目标色图片 → 输出 TOP-10 候选（含漆名 + 份数 + 预览色块 + ΔE）。三原色参考方案始终存在。漆料库 < 2 瓶时仅输出三原色方案。 |
| AC-4 | 3D预览 | 默认球体可见。上传 STL 可见。颜色/roughness/metalness 滑块生效。光源可拖拽。旋转缩放正常。取色暂存可发送到混色引擎。 |
| AC-5 | 配方 | 混色结果可保存 → 列表可查看 → 可删除。 |
| AC-6 | 色轮 | 可点击取色。互补/三角/类比色显示正确。颜色可发送到混色引擎。 |
| AC-7 | 测试 | `make test`（或等价命令）一键运行全量测试。GitHub Actions push 自动跑。 |
| AC-8 | Docker | `docker build` + `docker run` 启动。`docker-compose up` 启动全栈（backend + frontend + db）。 |
| AC-9 | CI | push → 自动测试 + Docker 镜像构建。构建失败阻止 merge。 |

---

## 10. 风险与未决问题 (Risks & Open Issues)

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| RGB 混色精度有限 | 透明漆(shade/contrast)混色偏差大；发灰/发脏无法预警 | 所有漆统一按不透明处理 MVP；已知局限在 UI 中明确告知；未来可升级至 Kubelka-Munk 光谱模型 |
| ΔE ≠ 人眼感知 | 算法排序与肉眼判断不一致 | 提供预览色块，用户肉眼最终决策；标注"算法排序仅供参考" |
| STL 大文件性能 | 高面数模型浏览器卡顿 | 50MB 上限；Three.js 自动 LOD 降低；必要时用 decimate 简化 |
| 冷启动数据 | 新用户无漆数据 → 混色引擎无法给出库漆方案 | 三原色方案始终可用；引导用户录入至少 2 瓶漆 |
| 邮件服务 | 126/QQ 邮箱 SMTP 限制 | 提前测试 QQ/Gmail SMTP；提供开发环境跳过邮件验证的 profile |
| Subagent 理解偏差 | 复杂需求 subagent 跑偏 | SPEC 尽可能完备；冷启动验证暴露 spec 缺陷；PLAN 颗粒度细 |
| Open Design 集成 | 技能与 Spring Boot 后端脱节 | Open Design 负责前端静态原型 + UI 组件；实际交互逻辑人工桥接 |

---

## 附录A：UI 重设计方案（2026-05-23 迭代）

> 迭代目标：用 Open Design Discord 设计系统重构前端界面，解决单页面拥堵、3D 预览局促、光源操作不灵活的问题。

### A.1 页面结构

| 路由 | 页面 | 说明 |
|------|------|------|
| `/paints` | 漆料库 | 独立全屏页面，完整 CRUD + 拍照取色 + 品牌筛选 |
| `/workspace` | 工作区 | 混色引擎 + 3D 预览左右分栏，核心操作页面 |
| `/recipes` | 配方库 | 已保存配方浏览/删除 |

默认登录后跳转 `/workspace`。

### A.2 导航设计 — 折叠侧边栏

- **默认收起**：左侧 56px 宽图标列
- **展开**：点击展开按钮或图标，侧边栏从左侧滑出 220px，覆盖部分主内容
- **关闭**：点击外部区域或关闭按钮
- **设计系统**：Discord 暗色主题（bg #313338, sidebar #2b2d31, icon hover #3f4147）

### A.3 工作区布局（/workspace）

混色面板(~320px 左) + 3D 预览(flex:1 右)。右侧包含材质球/STL模型、地面反射平面、多光源控制栏、材质控制栏。

### A.4 3D 预览增强

| 功能 | 描述 |
|------|------|
| **地面反射平面** | 灰色半透明 plane 置于 y=0，接收光源形成漫反射二级高光，模拟桌面 |
| **多光源** | 默认 1 个；[+添加] 新增；每个光源可拖拽小球标记位置；选中高亮可删除 |
| **光源颜色** | 选中后设置颜色（色温预设: 暖光3200K / 中性5500K / 冷光6500K + 自定义HEX） |
| **双模式定位** | 拖拽小球=粗调位置；选中后XYZ滑条=精调（两者同步） |
| **光源预设** | 顶光/侧光/正光快捷按钮 |
| **光源强度** | 每个光源独立强度滑块 (0-3) |
| **预览比例** | 3D 画布占工作区右侧全部剩余空间（≥60% 宽度） |

### A.5 漆料库页面（/paints）& 配方库页面（/recipes）

独立全屏页面，复用现有 PaintList/PaintForm/PhotoColorPicker 及 RecipeList/RecipeCard 组件。

### A.6 Open Design 集成

- **设计系统**：Discord
- **Skill**：`frontend-design`（通过 Open Design MCP 生成 UI 原型）
- **实际实现**：React + TypeScript + Discord 暗色 CSS

### A.7 验证标准

- `npm run build` 零 TypeScript 错误
- 侧边栏折叠/展开交互流畅
- 3D 预览地面反射+多光源可操作
- 后端 API 不变，所有现有接口持续可用
