# Miniature Painting Assistant

微缩模型涂装辅助工具 —— 录入自有漆色、取目标色、计算混色方案、3D 光影预览。

面向战锤/高达/D&D 微缩模型涂装爱好者的 Web 工具。解决"照抄教程偏色"和"自混代换翻车"两大核心痛点。

## Quick Start

```bash
# 一键启动全栈（需要 Docker）
docker-compose up --build

# Frontend: http://localhost
# Backend API: http://localhost:8080/api
# Health check: http://localhost:8080/api/health
```

## 本地开发

```bash
# 后端
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 前端（另开终端）
cd frontend
npm install
npm run dev
# → http://localhost:3000（自动代理 /api → backend:8080）
```

## 测试

```bash
make test
# 或分别运行:
# 后端: cd backend && mvn test -Dspring.profiles.active=dev
# 前端: cd frontend && npm test -- --run
```

## Docker

```bash
docker build -f Dockerfile.backend -t mini-paint-backend .
docker run -p 8080:8080 -e SPRING_DATASOURCE_URL=... mini-paint-backend

docker build -f Dockerfile.frontend -t mini-paint-frontend .
docker run -p 80:80 mini-paint-frontend
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/minipaint` | 数据库连接 |
| `SPRING_DATASOURCE_USERNAME` | `minipaint` | 数据库用户 |
| `SPRING_DATASOURCE_PASSWORD` | `minipaint` | 数据库密码 |
| `JWT_SECRET` | `change-me-in-production...` | JWT 签名密钥 |
| `MAIL_HOST` | `smtp.qq.com` | SMTP 服务器 |
| `MAIL_USERNAME` | — | 发件邮箱 |
| `MAIL_PASSWORD` | — | 邮箱授权码 |
| `UPLOAD_DIR` | `./uploads` | 文件上传目录 |
| `BASE_URL` | `http://localhost:8080` | 邮件链接前缀 |

## 技术栈

| 层 | 技术 |
|----|------|
| 后端 | Java 17 / Spring Boot 3 / Spring Security (JWT) / JPA (Hibernate) |
| 数据库 | PostgreSQL 16 |
| 前端 | React 18 / TypeScript / Vite / Three.js (React Three Fiber) |
| 状态管理 | Zustand |
| UI 设计 | Open Design — Discord 设计系统 |
| 测试 | JUnit 5 + Mockito (后端) / Vitest (前端) |
| 容器化 | Docker + docker-compose |
| CI | GitHub Actions |

## 目录结构

```
backend/                      Spring Boot REST API
  src/main/java/com/minipaint/
    controller/                REST 控制器
    service/                   业务逻辑
    model/                     JPA 实体
    repository/                Spring Data 仓库
    dto/                       数据传输对象
    config/                    安全/邮件/CORS 配置
    security/                  JWT 认证
    exception/                 全局异常处理

frontend/                     React SPA
  src/
    api/                       Axios API 客户端
    store/                     Zustand 状态管理
    pages/                     路由页面
    components/
      paint/                   漆料库 UI
      mix/                     混色引擎 UI + 色轮
      preview3d/               Three.js 3D 预览
      recipe/                  配方管理 UI
      common/                  公共组件

docker-compose.yml            PostgreSQL + Backend + Frontend
Dockerfile.backend            后端镜像
Dockerfile.frontend           前端镜像（Nginx + React）
nginx.conf                    Nginx SPA 路由配置

SPEC.md                       设计规约
PLAN.md                       实现计划
SPEC_PROCESS.md               规约与计划过程文档
AGENT_LOG.md                  智能体使用过程日志
```

## API 概览

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/auth/register` | POST | 注册 |
| `/api/auth/login` | POST | 登录 |
| `/api/auth/verify-email` | GET | 邮箱验证 |
| `/api/paints` | CRUD | 漆料管理 |
| `/api/mix` | POST | 混色计算 |
| `/api/recipes` | GET/POST/DELETE | 配方管理 |
| `/api/models` | GET/POST/DELETE | STL 3D 模型 |
| `/api/settings` | GET/PUT | 3D 预览默认设置 |
| `/api/health` | GET | 健康检查 |

## 许可证

本项目为 AI4SE 课程期末项目。MIT License.
