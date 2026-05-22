# Miniature Painting Assistant — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a web tool for miniature painters to photograph their paints, calculate mixing recipes from a target color, and preview results on 3D material balls with adjustable lighting.

**Architecture:** Spring Boot 3 REST API (Java 17) + React 18 SPA (TypeScript) with Three.js 3D preview + PostgreSQL 16. Frontend UI driven by Open Design Dashboard design system via MCP. Docker Compose for orchestration, GitHub Actions for CI.

**Tech Stack:** Java 17, Spring Boot 3, Spring Security, JPA/Hibernate, PostgreSQL 16, React 18, TypeScript, Three.js, React Three Fiber, Zustand, Axios, Vite, JUnit 5, Mockito, Vitest, Docker, docker-compose, GitHub Actions

---

## File Structure

### Backend (`backend/`)

```
src/main/java/com/minipaint/
├── MiniPaintApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── MailConfig.java
│   ├── CorsConfig.java
│   └── WebConfig.java
├── model/
│   ├── User.java
│   ├── VerificationToken.java
│   ├── Paint.java
│   ├── Recipe.java
│   ├── RecipeComponent.java
│   ├── SavedModel.java
│   └── UserSettings.java
├── repository/
│   ├── UserRepository.java
│   ├── VerificationTokenRepository.java
│   ├── PaintRepository.java
│   ├── RecipeRepository.java
│   ├── RecipeComponentRepository.java
│   ├── SavedModelRepository.java
│   └── UserSettingsRepository.java
├── service/
│   ├── AuthService.java
│   ├── EmailService.java
│   ├── PaintService.java
│   ├── MixService.java
│   ├── RecipeService.java
│   ├── ModelService.java
│   └── UserSettingsService.java
├── controller/
│   ├── AuthController.java
│   ├── PaintController.java
│   ├── MixController.java
│   ├── RecipeController.java
│   ├── ModelController.java
│   └── UserSettingsController.java
├── dto/
│   ├── RegisterRequest.java
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   ├── PaintRequest.java
│   ├── PaintResponse.java
│   ├── MixRequest.java
│   ├── MixCandidate.java
│   ├── MixResponse.java
│   ├── RecipeRequest.java
│   ├── RecipeResponse.java
│   ├── UserSettingsResponse.java
│   ├── UserSettingsRequest.java
│   └── ApiError.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── UserDetailsServiceImpl.java
│   └── JwtAuthFilter.java
└── exception/
    ├── GlobalExceptionHandler.java
    └── ResourceNotFoundException.java

src/main/resources/
├── application.yml
├── application-dev.yml
└── application-prod.yml

src/test/java/com/minipaint/
├── controller/
│   ├── AuthControllerTest.java
│   ├── PaintControllerTest.java
│   ├── MixControllerTest.java
│   └── RecipeControllerTest.java
└── service/
    ├── AuthServiceTest.java
    ├── PaintServiceTest.java
    ├── MixServiceTest.java
    └── RecipeServiceTest.java
```

### Frontend (`frontend/`)

```
src/
├── main.tsx
├── App.tsx
├── api/
│   ├── client.ts
│   ├── auth.ts
│   ├── paints.ts
│   ├── mix.ts
│   ├── recipes.ts
│   ├── models.ts
│   └── settings.ts
├── store/
│   ├── authStore.ts
│   ├── paintStore.ts
│   └── recipeStore.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── DashboardPage.tsx
│   └── EmailVerifiedPage.tsx
├── components/
│   ├── paint/
│   │   ├── PaintList.tsx
│   │   ├── PaintForm.tsx
│   │   └── PhotoColorPicker.tsx
│   ├── mix/
│   │   ├── TargetColorPicker.tsx
│   │   ├── MixResultCard.tsx
│   │   ├── MixResultList.tsx
│   │   └── ColorWheel.tsx
│   ├── preview3d/
│   │   ├── MaterialBall.tsx
│   │   ├── LightingControls.tsx
│   │   ├── MaterialControls.tsx
│   │   ├── GeometrySelector.tsx
│   │   └── StlUploader.tsx
│   ├── recipe/
│   │   ├── RecipeList.tsx
│   │   └── RecipeCard.tsx
│   └── common/
│       ├── Header.tsx
│       └── ProtectedRoute.tsx
└── types/
    └── index.ts

__tests__/
├── setup.ts
├── api/
│   └── client.test.ts
├── components/
│   ├── MixResultList.test.tsx
│   └── ColorWheel.test.tsx
└── store/
    └── authStore.test.ts
```

### Root

```
docker-compose.yml
Dockerfile.backend
Dockerfile.frontend
nginx.conf
.github/workflows/ci.yml
Makefile
README.md
```

---

## Phase 0: Project Scaffolding

### Task 0.1: Initialize Spring Boot project

> **Status:** DONE — commit `12463a1` (merged via PR #1)

**Files:**
- Create: `backend/pom.xml`
- Create: `backend/src/main/java/com/minipaint/MiniPaintApplication.java`
- Create: `backend/src/main/resources/application.yml`
- Create: `backend/src/main/resources/application-dev.yml`
- Create: `backend/src/test/java/com/minipaint/MiniPaintApplicationTests.java`

- [ ] **Step 1: Generate Spring Boot project skeleton**

Create `backend/pom.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.5</version>
    </parent>
    <groupId>com.minipaint</groupId>
    <artifactId>mini-paint-backend</artifactId>
    <version>0.1.0</version>
    <name>Miniature Painting Assistant</name>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-mail</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 2: Write MainApplication class**

Create `backend/src/main/java/com/minipaint/MiniPaintApplication.java`:
```java
package com.minipaint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MiniPaintApplication {
    public static void main(String[] args) {
        SpringApplication.run(MiniPaintApplication.class, args);
    }
}
```

- [ ] **Step 3: Write application config**

Create `backend/src/main/resources/application.yml`:
```yaml
server:
  port: 8080

spring:
  application:
    name: mini-paint
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/minipaint}
    username: ${SPRING_DATASOURCE_USERNAME:minipaint}
    password: ${SPRING_DATASOURCE_PASSWORD:minipaint}
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  mail:
    host: ${MAIL_HOST:smtp.qq.com}
    port: ${MAIL_PORT:587}
    username: ${MAIL_USERNAME:}
    password: ${MAIL_PASSWORD:}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB

app:
  jwt:
    secret: ${JWT_SECRET:change-me-in-production-minimum-256-bits}
    expiration-ms: 86400000
  upload-dir: ${UPLOAD_DIR:./uploads}
  base-url: ${BASE_URL:http://localhost:8080}
```

- [ ] **Step 4: Create dev profile**

Create `backend/src/main/resources/application-dev.yml`:
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:minipaint;DB_CLOSE_DELAY=-1
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: create-drop
    properties:
      hibernate:
        dialect: org.hibernate.dialect.H2Dialect
  h2:
    console:
      enabled: true
  mail:
    host: localhost
    port: 1025
    username: ""
    password: ""
```

- [ ] **Step 5: Write smoke test**

Create `backend/src/test/java/com/minipaint/MiniPaintApplicationTests.java`:
```java
package com.minipaint;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class MiniPaintApplicationTests {
    @Test
    void contextLoads() {
    }
}
```

- [ ] **Step 6: Verify it builds**

Run: `cd backend && mvn test -Dtest=MiniPaintApplicationTests`
Expected: BUILD SUCCESS, context loads

- [ ] **Step 7: Commit**

```bash
git add backend/
git commit -m "feat: scaffold Spring Boot project with dependencies"
```

---

### Task 0.2: Initialize React + Vite frontend

> **Status:** DONE — commit `11e9f63` (merged via PR #1)

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`

- [ ] **Step 1: Create package.json**

Create `frontend/package.json`:
```json
{
  "name": "mini-paint-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "@react-three/fiber": "^8.16.0",
    "@react-three/drei": "^9.108.0",
    "three": "^0.168.0",
    "three-stdlib": "^2.30.0",
    "zustand": "^4.5.0",
    "axios": "^1.7.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/three": "^0.168.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "jsdom": "^24.0.0"
  }
}
```

- [ ] **Step 2: Create vite config**

Create `frontend/vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
  },
});
```

- [ ] **Step 3: Create tsconfig.json**

Create `frontend/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create index.html and entry point**

Create `frontend/index.html`:
```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Miniature Painting Assistant</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `frontend/src/main.tsx`:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Create `frontend/src/App.tsx`:
```tsx
export default function App() {
  return (
    <div>
      <h1>Miniature Painting Assistant</h1>
    </div>
  );
}
```

- [ ] **Step 5: Install and verify**

Run: `cd frontend && npm install && npm run build && npm test -- --run`
Expected: all pass (0 tests, just verifies config works)

- [ ] **Step 6: Commit**

```bash
git add frontend/
git commit -m "feat: scaffold React + Vite + Three.js frontend"
```

---

### Task 0.3: Docker Compose scaffold

> **Status:** DONE — commit `11e9f63` (merged via PR #1)

**Files:**
- Create: `docker-compose.yml`
- Create: `Dockerfile.backend`
- Create: `Dockerfile.frontend`
- Create: `nginx.conf`

- [ ] **Step 1: Create docker-compose.yml**

Create `docker-compose.yml`:
```yaml
version: "3.9"
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: minipaint
      POSTGRES_PASSWORD: minipaint
      POSTGRES_DB: minipaint
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U minipaint"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/minipaint
      SPRING_DATASOURCE_USERNAME: minipaint
      SPRING_DATASOURCE_PASSWORD: minipaint
      UPLOAD_DIR: /app/uploads
    volumes:
      - uploads:/app/uploads
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  pgdata:
  uploads:
```

- [ ] **Step 2: Create Dockerfile.backend**

Create `Dockerfile.backend`:
```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY backend/pom.xml backend/mvnw ./
COPY backend/.mvn .mvn
RUN mvn dependency:resolve
COPY backend/src src
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN mkdir -p /app/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

- [ ] **Step 3: Create Dockerfile.frontend**

Create `Dockerfile.frontend`:
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

- [ ] **Step 4: Commit**

```bash
git add docker-compose.yml Dockerfile.backend Dockerfile.frontend nginx.conf
git commit -m "feat: add Docker Compose scaffold with PostgreSQL, backend, frontend"
```

---

## Phase 1: Account System

### Task 1.1: User entity and repository

> **Status:** DONE — commit `969e577` (subagent, TDD: 2/2 tests)

**Files:**
- Create: `backend/src/main/java/com/minipaint/model/User.java`
- Create: `backend/src/main/java/com/minipaint/model/VerificationToken.java`
- Create: `backend/src/main/java/com/minipaint/repository/UserRepository.java`
- Create: `backend/src/main/java/com/minipaint/repository/VerificationTokenRepository.java`

- [ ] **Step 1: Write the failing tests**

Create `backend/src/test/java/com/minipaint/service/AuthServiceTest.java`:
```java
package com.minipaint.service;

import com.minipaint.model.User;
import com.minipaint.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class AuthServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldSaveAndFindUserByEmail() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordHash("hashed_password");
        user.setNickname("Tester");
        userRepository.save(user);

        Optional<User> found = userRepository.findByEmail("test@example.com");
        assertThat(found).isPresent();
        assertThat(found.get().getNickname()).isEqualTo("Tester");
    }

    @Test
    void shouldReturnEmptyForUnknownEmail() {
        Optional<User> found = userRepository.findByEmail("nobody@example.com");
        assertThat(found).isEmpty();
    }

    @Test
    void shouldEnforceUniqueEmail() {
        User u1 = new User();
        u1.setEmail("dup@example.com");
        u1.setPasswordHash("pw1");
        u1.setNickname("A");
        userRepository.save(u1);

        User u2 = new User();
        u2.setEmail("dup@example.com");
        u2.setPasswordHash("pw2");
        u2.setNickname("B");

        assertThat(userRepository.findByEmail("dup@example.com")).isPresent();
    }
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && mvn test -Dtest=AuthServiceTest`
Expected: FAIL — User entity or repository does not exist

- [ ] **Step 3: Create User entity**

Create `backend/src/main/java/com/minipaint/model/User.java`:
```java
package com.minipaint.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 20)
    private String nickname;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(nullable = false, length = 20)
    private String role = "USER";

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public User() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
```

Create `backend/src/main/java/com/minipaint/model/VerificationToken.java`:
```java
package com.minipaint.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "verification_tokens")
public class VerificationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 255)
    private String token;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public VerificationToken() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
```

- [ ] **Step 4: Create repositories**

Create `backend/src/main/java/com/minipaint/repository/UserRepository.java`:
```java
package com.minipaint.repository;

import com.minipaint.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

Create `backend/src/main/java/com/minipaint/repository/VerificationTokenRepository.java`:
```java
package com.minipaint.repository;

import com.minipaint.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    void deleteByUserId(Long userId);
}
```

- [ ] **Step 5: Run tests again**

Run: `cd backend && mvn test -Dtest=AuthServiceTest`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add backend/src/main/java/com/minipaint/model/ backend/src/main/java/com/minipaint/repository/ backend/src/test/
git commit -m "feat: add User and VerificationToken entities with repositories"
```

---

### Task 1.2: Auth service — register, login, verify, reset

> **Status:** DONE — commit `9105a2e` (subagent, TDD: 4/4 tests, 15 files)

**Files:**
- Create: `backend/src/main/java/com/minipaint/dto/RegisterRequest.java`
- Create: `backend/src/main/java/com/minipaint/dto/LoginRequest.java`
- Create: `backend/src/main/java/com/minipaint/dto/LoginResponse.java`
- Create: `backend/src/main/java/com/minipaint/dto/ApiError.java`
- Create: `backend/src/main/java/com/minipaint/service/EmailService.java`
- Create: `backend/src/main/java/com/minipaint/service/AuthService.java`
- Create: `backend/src/main/java/com/minipaint/exception/ResourceNotFoundException.java`
- Modify: `backend/src/test/java/com/minipaint/service/AuthServiceTest.java`

- [ ] **Step 1: Write the failing test for register**

Update `backend/src/test/java/com/minipaint/service/AuthServiceTest.java` to add registration test:
```java
@Autowired
private AuthService authService;

@Test
void shouldRegisterUserSuccessfully() {
    RegisterRequest req = new RegisterRequest();
    req.setEmail("new@example.com");
    req.setPassword("password123");
    req.setNickname("NewUser");

    authService.register(req);

    Optional<User> user = userRepository.findByEmail("new@example.com");
    assertThat(user).isPresent();
    assertThat(user.get().getPasswordHash()).isNotEqualTo("password123");
    assertThat(user.get().isEmailVerified()).isFalse();
}

@Test
void shouldFailDuplicateRegistration() {
    RegisterRequest req = new RegisterRequest();
    req.setEmail("dup@example.com");
    req.setPassword("password123");
    req.setNickname("First");
    authService.register(req);

    RegisterRequest req2 = new RegisterRequest();
    req2.setEmail("dup@example.com");
    req2.setPassword("password456");
    req2.setNickname("Second");

    assertThatThrownBy(() -> authService.register(req2))
        .isInstanceOf(RuntimeException.class);
}
```

Run: `cd backend && mvn test -Dtest=AuthServiceTest`
Expected: FAIL — AuthService, RegisterRequest not defined

- [ ] **Step 2: Create DTOs**

Create `backend/src/main/java/com/minipaint/dto/RegisterRequest.java`:
```java
package com.minipaint.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 8, max = 100)
    private String password;
    @NotBlank @Size(min = 1, max = 20)
    private String nickname;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
}
```

Create `backend/src/main/java/com/minipaint/dto/LoginRequest.java`:
```java
package com.minipaint.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank @Email
    private String email;
    @NotBlank
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
```

Create `backend/src/main/java/com/minipaint/dto/LoginResponse.java`:
```java
package com.minipaint.dto;

public class LoginResponse {
    private String token;
    private UserInfo user;

    public LoginResponse(String token, UserInfo user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public UserInfo getUser() { return user; }

    public static class UserInfo {
        private Long id;
        private String nickname;
        private String email;

        public UserInfo(Long id, String nickname, String email) {
            this.id = id;
            this.nickname = nickname;
            this.email = email;
        }

        public Long getId() { return id; }
        public String getNickname() { return nickname; }
        public String getEmail() { return email; }
    }
}
```

Create `backend/src/main/java/com/minipaint/dto/ApiError.java`:
```java
package com.minipaint.dto;

import java.time.Instant;

public class ApiError {
    private int status;
    private String message;
    private Instant timestamp;

    public ApiError(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = Instant.now();
    }

    public int getStatus() { return status; }
    public String getMessage() { return message; }
    public Instant getTimestamp() { return timestamp; }
}
```

- [ ] **Step 3: Create EmailService**

Create `backend/src/main/java/com/minipaint/service/EmailService.java`:
```java
package com.minipaint.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String baseUrl;

    public EmailService(JavaMailSender mailSender,
                        @Value("${app.base-url}") String baseUrl) {
        this.mailSender = mailSender;
        this.baseUrl = baseUrl;
    }

    public void sendVerificationEmail(String to, String token) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Verify your email — Miniature Painting Assistant");
        msg.setText("Click to verify: " + baseUrl + "/api/auth/verify-email?token=" + token);
        mailSender.send(msg);
    }

    public void sendPasswordResetEmail(String to, String token) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Reset your password — Miniature Painting Assistant");
        msg.setText("Click to reset: " + baseUrl + "/api/auth/reset-password?token=" + token
                + "\nToken valid for 24 hours.");
        mailSender.send(msg);
    }
}
```

- [ ] **Step 4: Create AuthService**

Create `backend/src/main/java/com/minipaint/service/AuthService.java`:
```java
package com.minipaint.service;

import com.minipaint.dto.LoginRequest;
import com.minipaint.dto.LoginResponse;
import com.minipaint.dto.RegisterRequest;
import com.minipaint.model.User;
import com.minipaint.model.VerificationToken;
import com.minipaint.repository.UserRepository;
import com.minipaint.repository.VerificationTokenRepository;
import com.minipaint.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       VerificationTokenRepository tokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
    }

    @Transactional
    public void register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setNickname(req.getNickname());
        userRepository.save(user);

        String token = UUID.randomUUID().toString();
        VerificationToken vt = new VerificationToken();
        vt.setUser(user);
        vt.setToken(token);
        vt.setType("EMAIL_VERIFY");
        vt.setExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
        tokenRepository.save(vt);

        emailService.sendVerificationEmail(user.getEmail(), token);
    }

    @Transactional
    public void verifyEmail(String token) {
        VerificationToken vt = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (vt.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("Token expired");
        }
        User user = vt.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        tokenRepository.delete(vt);
    }

    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!user.isEmailVerified()) {
            throw new RuntimeException("Email not verified");
        }
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return new LoginResponse(token,
                new LoginResponse.UserInfo(user.getId(), user.getNickname(), user.getEmail()));
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        tokenRepository.deleteByUserId(user.getId());
        String token = UUID.randomUUID().toString();
        VerificationToken vt = new VerificationToken();
        vt.setUser(user);
        vt.setToken(token);
        vt.setType("PASSWORD_RESET");
        vt.setExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
        tokenRepository.save(vt);
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        VerificationToken vt = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (vt.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("Token expired");
        }
        User user = vt.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(vt);
    }
}
```

- [ ] **Step 5: Stub JwtTokenProvider**

Create `backend/src/main/java/com/minipaint/security/JwtTokenProvider.java`:
```java
package com.minipaint.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long expirationMs;

    public JwtTokenProvider(@Value("${app.jwt.secret}") String secret,
                            @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(Long userId, String email) {
        Date now = new Date();
        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    public Long getUserId(String token) {
        return Long.parseLong(Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject());
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

- [ ] **Step 6: Create SecurityConfig**

Create `backend/src/main/java/com/minipaint/config/SecurityConfig.java`:
```java
package com.minipaint.config;

import com.minipaint.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/health").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

- [ ] **Step 7: Create JwtAuthFilter**

Create `backend/src/main/java/com/minipaint/security/JwtAuthFilter.java`:
```java
package com.minipaint.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtTokenProvider.validateToken(token)) {
                Long userId = jwtTokenProvider.getUserId(token);
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

- [ ] **Step 8: Add dev profile mail config**

Create `backend/src/main/java/com/minipaint/config/MailConfig.java`:
```java
package com.minipaint.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Bean
    @Primary
    public JavaMailSender javaMailSender(
            @org.springframework.beans.factory.annotation.Value("${spring.mail.host}") String host,
            @org.springframework.beans.factory.annotation.Value("${spring.mail.port}") int port,
            @org.springframework.beans.factory.annotation.Value("${spring.mail.username}") String username,
            @org.springframework.beans.factory.annotation.Value("${spring.mail.password}") String password) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);
        sender.setUsername(username);
        sender.setPassword(password);
        Properties props = sender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        return sender;
    }
}
```

- [ ] **Step 9: Create CorsConfig**

Create `backend/src/main/java/com/minipaint/config/CorsConfig.java`:
```java
package com.minipaint.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

- [ ] **Step 10: Create AuthController**

Create `backend/src/main/java/com/minipaint/controller/AuthController.java`:
```java
package com.minipaint.controller;

import com.minipaint.dto.LoginRequest;
import com.minipaint.dto.LoginResponse;
import com.minipaint.dto.RegisterRequest;
import com.minipaint.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest req) {
        authService.register(req);
        return ResponseEntity.ok(Map.of("message", "Verification email sent"));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(Map.of("message", "Email verified"));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> body) {
        authService.forgotPassword(body.get("email"));
        return ResponseEntity.ok(Map.of("message", "Reset email sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> body) {
        authService.resetPassword(body.get("token"), body.get("newPassword"));
        return ResponseEntity.ok(Map.of("message", "Password reset"));
    }
}
```

- [ ] **Step 11: Run tests**

Run: `cd backend && mvn test -Dtest=AuthServiceTest -Dspring.profiles.active=dev`
Expected: PASS (may require @ActiveProfiles("dev") on test class)

- [ ] **Step 12: Commit**

```bash
git add backend/
git commit -m "feat: implement auth service with register, login, email verify, password reset"
```

---

## Phase 2: Paint Library

### Task 2.1: Paint entity + CRUD backend

> **Status:** DONE — commit `482f8fc` (subagent, TDD: 3/3 tests, 7 files)

**Files:** Create `backend/src/main/java/com/minipaint/model/Paint.java`, `backend/src/main/java/com/minipaint/repository/PaintRepository.java`, `backend/src/main/java/com/minipaint/dto/PaintRequest.java`, `backend/src/main/java/com/minipaint/dto/PaintResponse.java`, `backend/src/main/java/com/minipaint/service/PaintService.java`, `backend/src/main/java/com/minipaint/controller/PaintController.java`; Create test: `backend/src/test/java/com/minipaint/service/PaintServiceTest.java`

- [ ] **Step 1: Write failing test**

Create `backend/src/test/java/com/minipaint/service/PaintServiceTest.java`:
```java
package com.minipaint.service;

import com.minipaint.dto.PaintRequest;
import com.minipaint.dto.PaintResponse;
import com.minipaint.repository.PaintRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class PaintServiceTest {
    @Autowired private PaintService paintService;
    @Autowired private PaintRepository paintRepository;

    @Test
    void shouldCreateAndListPaints() {
        PaintRequest req = new PaintRequest();
        req.setBrand("GW"); req.setColorName("Russ Grey"); req.setColorCode("991899");
        req.setR(135); req.setG(156); req.setB(158);
        paintService.create(1L, req);

        List<PaintResponse> paints = paintService.listByUser(1L);
        assertThat(paints).hasSize(1);
        assertThat(paints.get(0).getColorName()).isEqualTo("Russ Grey");
    }
}
```
Expected: FAIL — PaintService not defined.

- [ ] **Step 2: Create Paint entity**

Create `backend/src/main/java/com/minipaint/model/Paint.java`:
```java
package com.minipaint.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "paints")
public class Paint {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id", nullable = false) private Long userId;
    @Column(nullable = false, length = 50) private String brand;
    @Column(name = "brand_other", length = 100) private String brandOther;
    @Column(name = "color_name", nullable = false, length = 100) private String colorName;
    @Column(name = "color_code", length = 30) private String colorCode;
    @Column(nullable = false) private int r;
    @Column(nullable = false) private int g;
    @Column(nullable = false) private int b;
    @Column(name = "image_url", length = 500) private String imageUrl;
    @Column(length = 500) private String notes;
    @Column(name = "is_deleted", nullable = false) private boolean isDeleted = false;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();

    public Paint() {}
    // getters/setters
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; } public void setUserId(Long userId) { this.userId = userId; }
    public String getBrand() { return brand; } public void setBrand(String brand) { this.brand = brand; }
    public String getBrandOther() { return brandOther; } public void setBrandOther(String brandOther) { this.brandOther = brandOther; }
    public String getColorName() { return colorName; } public void setColorName(String colorName) { this.colorName = colorName; }
    public String getColorCode() { return colorCode; } public void setColorCode(String colorCode) { this.colorCode = colorCode; }
    public int getR() { return r; } public void setR(int r) { this.r = r; }
    public int getG() { return g; } public void setG(int g) { this.g = g; }
    public int getB() { return b; } public void setB(int b) { this.b = b; }
    public String getImageUrl() { return imageUrl; } public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getNotes() { return notes; } public void setNotes(String notes) { this.notes = notes; }
    public boolean isDeleted() { return isDeleted; } public void setDeleted(boolean deleted) { isDeleted = deleted; }
    public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
```

- [ ] **Step 3: Create repository, DTOs, service, controller**

Create `backend/src/main/java/com/minipaint/repository/PaintRepository.java`:
```java
package com.minipaint.repository;
import com.minipaint.model.Paint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaintRepository extends JpaRepository<Paint, Long> {
    List<Paint> findByUserIdAndIsDeletedFalse(Long userId);
    List<Paint> findByUserIdAndBrandAndIsDeletedFalse(Long userId, String brand);
}
```

Create `backend/src/main/java/com/minipaint/dto/PaintRequest.java`:
```java
package com.minipaint.dto;
import jakarta.validation.constraints.*;

public class PaintRequest {
    @NotBlank private String brand;
    private String brandOther;
    @NotBlank @Size(max = 100) private String colorName;
    @Size(max = 30) private String colorCode;
    @Min(0) @Max(255) private int r;
    @Min(0) @Max(255) private int g;
    @Min(0) @Max(255) private int b;
    @Size(max = 500) private String notes;
    // getters/setters
    public String getBrand() { return brand; } public void setBrand(String brand) { this.brand = brand; }
    public String getBrandOther() { return brandOther; } public void setBrandOther(String brandOther) { this.brandOther = brandOther; }
    public String getColorName() { return colorName; } public void setColorName(String colorName) { this.colorName = colorName; }
    public String getColorCode() { return colorCode; } public void setColorCode(String colorCode) { this.colorCode = colorCode; }
    public int getR() { return r; } public void setR(int r) { this.r = r; }
    public int getG() { return g; } public void setG(int g) { this.g = g; }
    public int getB() { return b; } public void setB(int b) { this.b = b; }
    public String getNotes() { return notes; } public void setNotes(String notes) { this.notes = notes; }
}
```

Create `backend/src/main/java/com/minipaint/dto/PaintResponse.java`:
```java
package com.minipaint.dto;
import java.time.Instant;

public class PaintResponse {
    private Long id; private String brand, brandOther, colorName, colorCode, imageUrl, notes;
    private int r, g, b; private Instant createdAt;
    public PaintResponse() {}
    // full getters/setters
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getBrand() { return brand; } public void setBrand(String brand) { this.brand = brand; }
    public String getBrandOther() { return brandOther; } public void setBrandOther(String brandOther) { this.brandOther = brandOther; }
    public String getColorName() { return colorName; } public void setColorName(String colorName) { this.colorName = colorName; }
    public String getColorCode() { return colorCode; } public void setColorCode(String colorCode) { this.colorCode = colorCode; }
    public String getImageUrl() { return imageUrl; } public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getNotes() { return notes; } public void setNotes(String notes) { this.notes = notes; }
    public int getR() { return r; } public void setR(int r) { this.r = r; }
    public int getG() { return g; } public void setG(int g) { this.g = g; }
    public int getB() { return b; } public void setB(int b) { this.b = b; }
    public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
```

Create `backend/src/main/java/com/minipaint/service/PaintService.java`:
```java
package com.minipaint.service;
import com.minipaint.dto.PaintRequest;
import com.minipaint.dto.PaintResponse;
import com.minipaint.model.Paint;
import com.minipaint.repository.PaintRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaintService {
    private final PaintRepository repo;
    public PaintService(PaintRepository repo) { this.repo = repo; }

    @Transactional
    public PaintResponse create(Long userId, PaintRequest req) {
        Paint p = new Paint();
        p.setUserId(userId);
        mapRequest(p, req);
        return toResponse(repo.save(p));
    }

    public List<PaintResponse> listByUser(Long userId) {
        return repo.findByUserIdAndIsDeletedFalse(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PaintResponse getById(Long id) {
        Paint p = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        return toResponse(p);
    }

    @Transactional
    public PaintResponse update(Long id, PaintRequest req) {
        Paint p = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        mapRequest(p, req);
        return toResponse(repo.save(p));
    }

    @Transactional
    public void delete(Long id) {
        Paint p = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        p.setDeleted(true);
        repo.save(p);
    }

    private void mapRequest(Paint p, PaintRequest req) {
        p.setBrand(req.getBrand()); p.setBrandOther(req.getBrandOther());
        p.setColorName(req.getColorName()); p.setColorCode(req.getColorCode());
        p.setR(req.getR()); p.setG(req.getG()); p.setB(req.getB());
        p.setNotes(req.getNotes());
    }

    private PaintResponse toResponse(Paint p) {
        PaintResponse r = new PaintResponse();
        r.setId(p.getId()); r.setBrand(p.getBrand()); r.setBrandOther(p.getBrandOther());
        r.setColorName(p.getColorName()); r.setColorCode(p.getColorCode());
        r.setR(p.getR()); r.setG(p.getG()); r.setB(p.getB());
        r.setImageUrl(p.getImageUrl()); r.setNotes(p.getNotes());
        r.setCreatedAt(p.getCreatedAt());
        return r;
    }
}
```

Create `backend/src/main/java/com/minipaint/controller/PaintController.java`:
```java
package com.minipaint.controller;
import com.minipaint.dto.PaintRequest;
import com.minipaint.dto.PaintResponse;
import com.minipaint.service.PaintService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/paints")
public class PaintController {
    private final PaintService service;
    public PaintController(PaintService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<PaintResponse>> list(Authentication auth) {
        return ResponseEntity.ok(service.listByUser((Long) auth.getPrincipal()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaintResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<PaintResponse> create(@Valid @RequestBody PaintRequest req, Authentication auth) {
        return ResponseEntity.ok(service.create((Long) auth.getPrincipal(), req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaintResponse> update(@PathVariable Long id, @Valid @RequestBody PaintRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}
```

- [ ] **Step 4: Run test**

Run: `cd backend && mvn test -Dtest=PaintServiceTest`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/com/minipaint/model/Paint.java backend/src/main/java/com/minipaint/repository/PaintRepository.java backend/src/main/java/com/minipaint/dto/PaintRequest.java backend/src/main/java/com/minipaint/dto/PaintResponse.java backend/src/main/java/com/minipaint/service/PaintService.java backend/src/main/java/com/minipaint/controller/PaintController.java backend/src/test/java/com/minipaint/service/PaintServiceTest.java
git commit -m "feat: add paint CRUD with brand/color/RGB fields"
```

---

### Task 2.2: Paint photo upload + color extraction endpoint

> **Status:** DONE — commit `ecd7af2` (subagent, TDD: 4/4 tests, WebConfig + PaintService.uploadPhoto)

**Files:** Modify `backend/src/main/java/com/minipaint/service/PaintService.java`; Create `backend/src/main/java/com/minipaint/config/WebConfig.java`

- [ ] **Step 1: Write failing test**

Append to `PaintServiceTest.java`:
```java
@Test
void shouldUploadPhotoAndUpdateImageUrl() {
    PaintRequest req = new PaintRequest();
    req.setBrand("GW"); req.setColorName("Test"); req.setR(100); req.setG(100); req.setB(100);
    PaintResponse created = paintService.create(1L, req);
    byte[] dummyImage = new byte[]{0x89, 0x50, 0x4E, 0x47}; // fake PNG header
    paintService.uploadPhoto(created.getId(), dummyImage, "test.png");
    PaintResponse updated = paintService.getById(created.getId());
    assertThat(updated.getImageUrl()).isNotNull();
}
```

- [ ] **Step 2: Implement photo upload**

Create `backend/src/main/java/com/minipaint/config/WebConfig.java`:
```java
package com.minipaint.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Path;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${app.upload-dir}") private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + Path.of(uploadDir).toAbsolutePath() + "/");
    }
}
```

Add method to `PaintService.java`:
```java
@Value("${app.upload-dir}") private String uploadDir;

@Transactional
public void uploadPhoto(Long paintId, byte[] fileBytes, String filename) {
    Paint p = repo.findById(paintId).orElseThrow(() -> new RuntimeException("Not found"));
    Path dir = Path.of(uploadDir, "paints");
    dir.toFile().mkdirs();
    String storedName = UUID.randomUUID() + "_" + filename;
    Files.write(dir.resolve(storedName), fileBytes);
    p.setImageUrl("/uploads/paints/" + storedName);
    repo.save(p);
}
```

- [ ] **Step 3: Run test → pass**

Run: `cd backend && mvn test -Dtest=PaintServiceTest`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add backend/
git commit -m "feat: add paint photo upload with local storage"
```

---

## Phase 3: Mixing Engine

### Task 3.1: Mix algorithm + endpoint

> **Status:** DONE — subagent, TDD: 4/4 tests, 6 files (brute-force parts-based search, tricolor, Delta E)

**Files:** Create `backend/src/main/java/com/minipaint/dto/MixRequest.java`, `backend/src/main/java/com/minipaint/dto/MixCandidate.java`, `backend/src/main/java/com/minipaint/dto/MixResponse.java`, `backend/src/main/java/com/minipaint/service/MixService.java`, `backend/src/main/java/com/minipaint/controller/MixController.java`; Create test: `backend/src/test/java/com/minipaint/service/MixServiceTest.java`

- [ ] **Step 1: Write failing test**

Create `backend/src/test/java/com/minipaint/service/MixServiceTest.java`:
```java
package com.minipaint.service;

import com.minipaint.dto.*;
import com.minipaint.model.Paint;
import com.minipaint.repository.PaintRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class MixServiceTest {
    @Autowired private MixService mixService;
    @Autowired private PaintRepository paintRepository;

    private void addPaint(String name, int r, int g, int b) {
        Paint p = new Paint(); p.setUserId(1L); p.setBrand("GW");
        p.setColorName(name); p.setR(r); p.setG(g); p.setB(b);
        paintRepository.save(p);
    }

    @Test
    void shouldReturnTricolorAndCandidates() {
        addPaint("Red", 200, 30, 30);
        addPaint("Blue", 30, 30, 200);
        addPaint("White", 255, 255, 255);

        MixResponse resp = mixService.mix(1L, 120, 130, 130);
        assertThat(resp.getTricolor()).isNotNull();
        assertThat(resp.getCandidates()).isNotEmpty();
        assertThat(resp.getCandidates().get(0).getDeltaE()).isGreaterThanOrEqualTo(0);
    }

    @Test
    void shouldReturnOnlyTricolorWhenNoPaints() {
        MixResponse resp = mixService.mix(999L, 120, 130, 130);
        assertThat(resp.getTricolor()).isNotNull();
        assertThat(resp.getCandidates()).isEmpty();
    }
}
```
Run: `cd backend && mvn test -Dtest=MixServiceTest`
Expected: FAIL

- [ ] **Step 2: Create DTOs**

Create `MixRequest.java`:
```java
package com.minipaint.dto;
import jakarta.validation.constraints.Max; import jakarta.validation.constraints.Min;
public class MixRequest {
    @Min(0) @Max(255) private int targetR;
    @Min(0) @Max(255) private int targetG;
    @Min(0) @Max(255) private int targetB;
    private int maxPaints = 3;
    // getters/setters
    public int getTargetR() { return targetR; } public void setTargetR(int r) { this.targetR = r; }
    public int getTargetG() { return targetG; } public void setTargetG(int g) { this.targetG = g; }
    public int getTargetB() { return targetB; } public void setTargetB(int b) { this.targetB = b; }
    public int getMaxPaints() { return maxPaints; } public void setMaxPaints(int m) { this.maxPaints = m; }
}
```

Create `MixCandidate.java`:
```java
package com.minipaint.dto;
import java.util.List;

public class MixCandidate {
    private List<Component> components;
    private int mixedR, mixedG, mixedB;
    private double deltaE;
    private String previewHex;

    public static class Component {
        private Long paintId; private String paintName; private int ratio; private boolean traceAmount;
        public Component(Long id, String name, int ratio, boolean trace) {
            this.paintId = id; this.paintName = name; this.ratio = ratio; this.traceAmount = trace;
        }
        public Long getPaintId() { return paintId; } public String getPaintName() { return paintName; }
        public int getRatio() { return ratio; } public boolean isTraceAmount() { return traceAmount; }
    }

    public MixCandidate(List<Component> comps, int mr, int mg, int mb, double de, String hex) {
        this.components = comps; this.mixedR = mr; this.mixedG = mg; this.mixedB = mb;
        this.deltaE = de; this.previewHex = hex;
    }
    public List<Component> getComponents() { return components; }
    public int getMixedR() { return mixedR; } public int getMixedG() { return mixedG; } public int getMixedB() { return mixedB; }
    public double getDeltaE() { return deltaE; } public String getPreviewHex() { return previewHex; }
}
```

Create `MixResponse.java`:
```java
package com.minipaint.dto;
import java.util.List;

public class MixResponse {
    private Tricolor tricolor;
    private List<MixCandidate> candidates;

    public static class Tricolor {
        private double cyan, magenta, yellow, white;
        public Tricolor(double c, double m, double y, double w) {
            this.cyan = c; this.magenta = m; this.yellow = y; this.white = w;
        }
        public double getCyan() { return cyan; } public double getMagenta() { return magenta; }
        public double getYellow() { return yellow; } public double getWhite() { return white; }
    }

    public MixResponse(Tricolor t, List<MixCandidate> c) { this.tricolor = t; this.candidates = c; }
    public Tricolor getTricolor() { return tricolor; }
    public List<MixCandidate> getCandidates() { return candidates; }
}
```

- [ ] **Step 3: Create MixService**

Create `backend/src/main/java/com/minipaint/service/MixService.java`:
```java
package com.minipaint.service;

import com.minipaint.dto.*;
import com.minipaint.model.Paint;
import com.minipaint.repository.PaintRepository;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MixService {
    private final PaintRepository paintRepo;

    public MixService(PaintRepository paintRepo) { this.paintRepo = paintRepo; }

    public MixResponse mix(Long userId, int targetR, int targetG, int targetB) {
        List<Paint> paints = paintRepo.findByUserIdAndIsDeletedFalse(userId);
        MixResponse.Tricolor tricolor = computeTricolor(targetR, targetG, targetB);
        List<MixCandidate> candidates = new ArrayList<>();
        if (paints.size() >= 2) {
            candidates = computeCandidates(targetR, targetG, targetB, paints);
        }
        return new MixResponse(tricolor, candidates);
    }

    private MixResponse.Tricolor computeTricolor(int tr, int tg, int tb) {
        double c = 1.0 - (tr / 255.0);
        double m = 1.0 - (tg / 255.0);
        double y = 1.0 - (tb / 255.0);
        double w = Math.min(Math.min(c, m), y);
        c = (c - w) / (1 - w + 0.001);
        m = (m - w) / (1 - w + 0.001);
        y = (y - w) / (1 - w + 0.001);
        return new MixResponse.Tricolor(
            Math.round(c * 100.0) / 100.0,
            Math.round(m * 100.0) / 100.0,
            Math.round(y * 100.0) / 100.0,
            Math.round(w * 100.0) / 100.0
        );
    }

    private List<MixCandidate> computeCandidates(int tr, int tg, int tb, List<Paint> paints) {
        List<MixCandidate> results = new ArrayList<>();
        int n = paints.size();
        int[] parts = {1, 2, 3, 4};

        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                for (int a : parts) {
                    for (int b : parts) {
                        if (a + b > 5) continue;
                        double da = (double) a / (a + b);
                        double db = (double) b / (a + b);
                        int mr = clamp(da * paints.get(i).getR() + db * paints.get(j).getR());
                        int mg = clamp(da * paints.get(i).getG() + db * paints.get(j).getG());
                        int mb = clamp(da * paints.get(i).getB() + db * paints.get(j).getB());
                        double de = deltaE(tr, tg, tb, mr, mg, mb);
                        results.add(buildCandidate(
                            new int[][]{{i, a}, {j, b}}, mr, mg, mb, de, paints));
                    }
                }
            }
        }

        // 3-paint mixes (sample combinations, 1:1:1, 1:1:2, 1:2:2)
        if (n >= 3) {
            int[][] triples = {{1,1,1},{1,1,2},{1,2,2},{1,1,3}};
            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    for (int k = j + 1; k < n; k++) {
                        for (int[] t : triples) {
                            double sum = t[0] + t[1] + t[2];
                            int mr = clamp((t[0]*paints.get(i).getR()+t[1]*paints.get(j).getR()+t[2]*paints.get(k).getR())/sum);
                            int mg = clamp((t[0]*paints.get(i).getG()+t[1]*paints.get(j).getG()+t[2]*paints.get(k).getG())/sum);
                            int mb = clamp((t[0]*paints.get(i).getB()+t[1]*paints.get(j).getB()+t[2]*paints.get(k).getB())/sum);
                            double de = deltaE(tr, tg, tb, mr, mg, mb);
                            results.add(buildCandidate(
                                new int[][]{{i,t[0]},{j,t[1]},{k,t[2]}}, mr, mg, mb, de, paints));
                        }
                    }
                }
            }
        }

        results.sort(Comparator.comparingDouble(MixCandidate::getDeltaE));
        return results.stream().limit(10).collect(Collectors.toList());
    }

    private MixCandidate buildCandidate(int[][] parts, int mr, int mg, int mb, double de, List<Paint> paints) {
        int total = 0;
        for (int[] p : parts) total += p[1];
        List<MixCandidate.Component> comps = new ArrayList<>();
        for (int[] p : parts) {
            Paint paint = paints.get(p[0]);
            boolean trace = ((double) p[1] / total) <= 0.1;
            comps.add(new MixCandidate.Component(paint.getId(), paint.getColorName(), p[1], trace));
        }
        String hex = String.format("#%02X%02X%02X", mr, mg, mb);
        return new MixCandidate(comps, mr, mg, mb, Math.round(de*100.0)/100.0, hex);
    }

    private double deltaE(int r1, int g1, int b1, int r2, int g2, int b2) {
        return Math.sqrt(Math.pow(r1-r2,2)+Math.pow(g1-g2,2)+Math.pow(b1-b2,2));
    }

    private int clamp(double v) { return (int) Math.min(255, Math.max(0, Math.round(v))); }
}
```

- [ ] **Step 4: Create MixController**

Create `backend/src/main/java/com/minipaint/controller/MixController.java`:
```java
package com.minipaint.controller;
import com.minipaint.dto.MixRequest;
import com.minipaint.dto.MixResponse;
import com.minipaint.service.MixService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mix")
public class MixController {
    private final MixService service;
    public MixController(MixService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<MixResponse> mix(@Valid @RequestBody MixRequest req, Authentication auth) {
        return ResponseEntity.ok(
            service.mix((Long) auth.getPrincipal(), req.getTargetR(), req.getTargetG(), req.getTargetB()));
    }
}
```

- [ ] **Step 5: Run test → pass**

Run: `cd backend && mvn test -Dtest=MixServiceTest`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add backend/
git commit -m "feat: add mixing engine with brute-force search, tricolor reference, Delta E sorting"
```

---

## Phase 4: Recipe Management

### Task 4.1: Recipe entity + CRUD backend

**Files:** Create `backend/src/main/java/com/minipaint/model/Recipe.java`, `backend/src/main/java/com/minipaint/model/RecipeComponent.java`, `backend/src/main/java/com/minipaint/repository/RecipeRepository.java`, `backend/src/main/java/com/minipaint/repository/RecipeComponentRepository.java`, `backend/src/main/java/com/minipaint/dto/RecipeRequest.java`, `backend/src/main/java/com/minipaint/dto/RecipeResponse.java`, `backend/src/main/java/com/minipaint/service/RecipeService.java`, `backend/src/main/java/com/minipaint/controller/RecipeController.java`; Create test: `backend/src/test/java/com/minipaint/service/RecipeServiceTest.java`

- [ ] **Step 1: Write failing test**

Create `RecipeServiceTest.java`:
```java
package com.minipaint.service;
import com.minipaint.dto.*;
import com.minipaint.model.Paint;
import com.minipaint.repository.PaintRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest @ActiveProfiles("dev") @Transactional
class RecipeServiceTest {
    @Autowired private RecipeService recipeService;
    @Autowired private PaintRepository paintRepository;

    @Test
    void shouldSaveAndListRecipe() {
        Paint p = new Paint(); p.setUserId(1L); p.setBrand("GW");
        p.setColorName("Red"); p.setR(200); p.setG(30); p.setB(30);
        paintRepository.save(p);

        RecipeRequest req = new RecipeRequest();
        req.setName("Dark Red Armor");
        req.setTargetR(100); req.setTargetG(20); req.setTargetB(20);
        req.setComponents(List.of(Map.of("paintId", p.getId(), "ratio", 2)));

        RecipeResponse saved = recipeService.create(1L, req);
        assertThat(saved.getName()).isEqualTo("Dark Red Armor");
        assertThat(recipeService.listByUser(1L)).hasSize(1);
    }
}
```
Expected: FAIL

- [ ] **Step 2: Create entities**

Create `Recipe.java`:
```java
package com.minipaint.model;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "recipes")
public class Recipe {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "user_id", nullable = false) private Long userId;
    @Column(nullable = false, length = 100) private String name;
    @Column(length = 500) private String description;
    @Column(name = "target_r") private Integer targetR;
    @Column(name = "target_g") private Integer targetG;
    @Column(name = "target_b") private Integer targetB;
    @Column(name = "target_image_url", length = 500) private String targetImageUrl;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeComponent> components = new ArrayList<>();

    public Recipe() {}
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; } public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public Integer getTargetR() { return targetR; } public void setTargetR(Integer r) { this.targetR = r; }
    public Integer getTargetG() { return targetG; } public void setTargetG(Integer g) { this.targetG = g; }
    public Integer getTargetB() { return targetB; } public void setTargetB(Integer b) { this.targetB = b; }
    public String getTargetImageUrl() { return targetImageUrl; } public void setTargetImageUrl(String url) { this.targetImageUrl = url; }
    public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant t) { this.createdAt = t; }
    public List<RecipeComponent> getComponents() { return components; } public void setComponents(List<RecipeComponent> c) { this.components = c; }
}
```

Create `RecipeComponent.java`:
```java
package com.minipaint.model;
import jakarta.persistence.*;

@Entity @Table(name = "recipe_components")
public class RecipeComponent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "recipe_id", nullable = false) private Recipe recipe;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "paint_id", nullable = false) private Paint paint;
    @Column(nullable = false) private int ratio;
    @Column(name = "is_tricolor", nullable = false) private boolean isTricolor = false;

    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Recipe getRecipe() { return recipe; } public void setRecipe(Recipe r) { this.recipe = r; }
    public Paint getPaint() { return paint; } public void setPaint(Paint p) { this.paint = p; }
    public int getRatio() { return ratio; } public void setRatio(int r) { this.ratio = r; }
    public boolean isTricolor() { return isTricolor; } public void setTricolor(boolean t) { this.isTricolor = t; }
}
```

Create repositories, DTOs, service, controller (standard CRUD pattern matching Task 1.1 / 2.1 structure).

- [ ] **Step 3: Run test → pass & commit**

```bash
git add backend/
git commit -m "feat: add recipe CRUD with components (paint_id + ratio)"
```

---

## Phase 5: 3D Preview Backend

### Task 5.1: STL model upload + user settings

**Files:** Create `backend/src/main/java/com/minipaint/model/SavedModel.java`, `backend/src/main/java/com/minipaint/model/UserSettings.java`, `backend/src/main/java/com/minipaint/repository/SavedModelRepository.java`, `backend/src/main/java/com/minipaint/repository/UserSettingsRepository.java`, `backend/src/main/java/com/minipaint/service/ModelService.java`, `backend/src/main/java/com/minipaint/controller/ModelController.java`, `backend/src/main/java/com/minipaint/controller/UserSettingsController.java`

Implement following the same TDD pattern: failing test → entity + repo → service → controller → pass → commit.

- [ ] **Step 1: ModelService test → fail**

- [ ] **Step 2: Implement ModelService (upload STL up to 50MB, list/delete by user)**

- [ ] **Step 3: Implement UserSettingsController (GET/PUT defaults for roughness/metalness/light)**

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: add STL upload endpoint and user settings CRUD"
```
Expected commit for this block when completed.

---

## Phase 6: Global Exception Handler

### Task 6.1: Exception handler + health endpoint

**Files:** Create `backend/src/main/java/com/minipaint/exception/GlobalExceptionHandler.java`, `backend/src/main/java/com/minipaint/exception/ResourceNotFoundException.java`; Modify `backend/src/main/java/com/minipaint/config/SecurityConfig.java`

- [ ] **Step 1: Create exception classes**

Create `ResourceNotFoundException.java`:
```java
package com.minipaint.exception;
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String msg) { super(msg); }
}
```

Create `GlobalExceptionHandler.java`:
```java
package com.minipaint.exception;
import com.minipaint.dto.ApiError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError(404, e.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiError> handleRuntime(RuntimeException e) {
        int status = e.getMessage().contains("Invalid email or password") ? 401 : 400;
        return ResponseEntity.status(status).body(new ApiError(status, e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(new ApiError(400, msg));
    }
}
```

- [ ] **Step 2: Add health endpoint**

Add to `SecurityConfig.java` (already permitted in Phase 1):
Create `backend/src/main/java/com/minipaint/controller/HealthController.java`:
```java
package com.minipaint.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthController {
    @GetMapping("/api/health")
    public Map<String, String> health() { return Map.of("status", "UP"); }
}
```

- [ ] **Step 3: Commit**

```bash
git add backend/
git commit -m "feat: add global exception handler and health endpoint"
```

---

## Phase 7: Frontend — API Layer + Auth Store + Pages

### Task 7.1: API client + Auth pages

**Files:** Create `frontend/src/api/client.ts`, `frontend/src/api/auth.ts`, `frontend/src/store/authStore.ts`, `frontend/src/types/index.ts`, `frontend/src/pages/LoginPage.tsx`, `frontend/src/pages/RegisterPage.tsx`, `frontend/src/pages/ForgotPasswordPage.tsx`, `frontend/src/pages/ResetPasswordPage.tsx`, `frontend/src/pages/EmailVerifiedPage.tsx`, `frontend/src/components/common/ProtectedRoute.tsx`, `frontend/src/App.tsx`; Modify `frontend/src/main.tsx`

- [ ] **Step 1: Write failing frontend test**

Create `frontend/src/__tests__/store/authStore.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';

describe('authStore', () => {
  it('should have null token initially', () => {
    // Will import and test after store creation
    expect(true).toBe(true);
  });
});
```
Run: `cd frontend && npm test -- --run`
Expected: PASS (placeholder test)

- [ ] **Step 2: Create types and API client**

Create `frontend/src/types/index.ts`:
```typescript
export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { email: string; password: string; nickname: string; }
export interface LoginResponse { token: string; user: { id: number; nickname: string; email: string; }; }
export interface PaintResponse { id: number; brand: string; brandOther?: string; colorName: string; colorCode?: string; r: number; g: number; b: number; imageUrl?: string; notes?: string; createdAt: string; }
export interface PaintRequest { brand: string; brandOther?: string; colorName: string; colorCode?: string; r: number; g: number; b: number; notes?: string; }
export interface MixRequest { targetR: number; targetG: number; targetB: number; maxPaints?: number; }
export interface MixCandidate { components: { paintId: number; paintName: string; ratio: number; traceAmount: boolean; }[]; mixedR: number; mixedG: number; mixedB: number; deltaE: number; previewHex: string; }
export interface MixResponse { tricolor: { cyan: number; magenta: number; yellow: number; white: number; }; candidates: MixCandidate[]; }
export interface RecipeRequest { name: string; description?: string; targetR?: number; targetG?: number; targetB?: number; components: { paintId: number; ratio: number; }[]; }
export interface RecipeResponse { id: number; name: string; description?: string; targetR?: number; targetG?: number; targetB?: number; components: { paintId: number; paintName?: string; ratio: number; }[]; createdAt: string; }
```

Create `frontend/src/api/client.ts`:
```typescript
import axios from 'axios';

const client = axios.create({ baseURL: '/api' });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default client;
```

Create `frontend/src/api/auth.ts`:
```typescript
import client from './client';
import type { LoginRequest, RegisterRequest, LoginResponse } from '../types';

export const authApi = {
  login: (data: LoginRequest) => client.post<LoginResponse>('/auth/login', data),
  register: (data: RegisterRequest) => client.post('/auth/register', data),
  verifyEmail: (token: string) => client.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (email: string) => client.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => client.post('/auth/reset-password', { token, newPassword }),
};
```

Create `frontend/src/api/paints.ts`:
```typescript
import client from './client';
import type { PaintRequest, PaintResponse } from '../types';

export const paintsApi = {
  list: () => client.get<PaintResponse[]>('/paints'),
  get: (id: number) => client.get<PaintResponse>(`/paints/${id}`),
  create: (data: PaintRequest) => client.post<PaintResponse>('/paints', data),
  update: (id: number, data: PaintRequest) => client.put<PaintResponse>(`/paints/${id}`, data),
  delete: (id: number) => client.delete(`/paints/${id}`),
};
```

Create `frontend/src/api/mix.ts`:
```typescript
import client from './client';
import type { MixRequest, MixResponse } from '../types';

export const mixApi = {
  mix: (data: MixRequest) => client.post<MixResponse>('/mix', data),
};
```

Create `frontend/src/api/recipes.ts`:
```typescript
import client from './client';
import type { RecipeRequest, RecipeResponse } from '../types';

export const recipesApi = {
  list: () => client.get<RecipeResponse[]>('/recipes'),
  create: (data: RecipeRequest) => client.post<RecipeResponse>('/recipes', data),
  delete: (id: number) => client.delete(`/recipes/${id}`),
};
```

- [ ] **Step 3: Create auth store**

Create `frontend/src/store/authStore.ts`:
```typescript
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: { id: number; nickname: string; email: string } | null;
  login: (token: string, user: { id: number; nickname: string; email: string }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
  isAuthenticated: () => !!get().token,
}));
```

- [ ] **Step 4: Create auth pages**

Create `LoginPage.tsx`:
```tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      const res = await authApi.login({ email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Login</button>
      </form>
      <p><Link to="/register">Register</Link> | <Link to="/forgot-password">Forgot Password?</Link></p>
    </div>
  );
}
```

Create `RegisterPage.tsx`, `ForgotPasswordPage.tsx`, `ResetPasswordPage.tsx`, `EmailVerifiedPage.tsx` following the same input/form pattern.

- [ ] **Step 5: Create ProtectedRoute + update App.tsx**

Create `ProtectedRoute.tsx`:
```tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated());
  if (!isAuth) return <Navigate to="/login" />;
  return <>{children}</>;
}
```

Update `App.tsx`:
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EmailVerifiedPage from './pages/EmailVerifiedPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<EmailVerifiedPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Update `main.tsx` (add `import './index.css';` if needed).

- [ ] **Step 6: Install deps + verify build**

Run: `cd frontend && npm install && npm run build`
Expected: BUILD SUCCESS

- [ ] **Step 7: Commit**

```bash
git add frontend/
git commit -m "feat: add auth pages with login, register, password reset, routing"
```

---

### Task 7.2: Paint library frontend + Photo color picker

**Files:** Create `frontend/src/components/paint/PaintList.tsx`, `frontend/src/components/paint/PaintForm.tsx`, `frontend/src/components/paint/PhotoColorPicker.tsx`; Create `frontend/src/store/paintStore.ts`

- [ ] **Step 1: Create PaintList with CRUD**

`PaintList.tsx` renders a table from `paintStore`, with brand filter dropdown (GW/AV/AK/GSW/Scale75/Other), search input, "Add" button that opens `PaintForm`.

- [ ] **Step 2: Create PaintForm with PhotoColorPicker**

`PaintForm.tsx` form with: brand select, colorName text, colorCode text, RGB sliders (populated by PhotoColorPicker), notes textarea.

`PhotoColorPicker.tsx`: file input → Canvas image → click to read RGB at cursor point → populate RGB values in parent form.

- [ ] **Step 3: Create paintStore**

Create `frontend/src/store/paintStore.ts`:
```typescript
import { create } from 'zustand';
import { paintsApi } from '../api/paints';
import type { PaintRequest, PaintResponse } from '../types';

interface PaintState {
  paints: PaintResponse[]; loading: boolean;
  fetch: () => Promise<void>;
  create: (p: PaintRequest) => Promise<void>;
  update: (id: number, p: PaintRequest) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const usePaintStore = create<PaintState>((set) => ({
  paints: [], loading: false,
  fetch: async () => {
    set({ loading: true });
    const res = await paintsApi.list();
    set({ paints: res.data, loading: false });
  },
  create: async (p) => { await paintsApi.create(p); await usePaintStore.getState().fetch(); },
  update: async (id, p) => { await paintsApi.update(id, p); await usePaintStore.getState().fetch(); },
  remove: async (id) => { await paintsApi.delete(id); await usePaintStore.getState().fetch(); },
}));
```

- [ ] **Step 4: Commit**

```bash
git add frontend/
git commit -m "feat: add paint library UI with CRUD and photo color pickup"
```

---

## Phase 8: 3D Preview Frontend

### Task 8.1: Three.js Material Ball component

**Files:** Create `frontend/src/components/preview3d/MaterialBall.tsx`, `frontend/src/components/preview3d/LightingControls.tsx`, `frontend/src/components/preview3d/MaterialControls.tsx`, `frontend/src/components/preview3d/GeometrySelector.tsx`, `frontend/src/components/preview3d/StlUploader.tsx`

- [ ] **Step 1: Create MaterialBall with React Three Fiber**

`MaterialBall.tsx` wraps a `<Canvas>` with:
- OrbitControls (rotate, zoom, pan)
- Mesh with MeshStandardMaterial (color, roughness, metalness from props)
- 1–3 DirectionalLights with DragControls for position
- AmbientLight for base illumination
- Ground plane for shadow reference
- Click handler: raycast → get pixel color at click point → "send to mix" callback

`LightingControls.tsx`: sliders for light count (1-3), color temp per light (2700K–6500K), toggle on/off. Preset buttons: top light, side light, bottom light.

`MaterialControls.tsx`: color picker input, roughness slider (0–1), metalness slider (0–1). "Apply from mix result" button (accepts RGB hex).

`GeometrySelector.tsx`: radio buttons for sphere/cube/cylinder. Triggers geometry switch in MaterialBall.

`StlUploader.tsx`: file input (accept .stl, max 50MB). On upload, load via STLLoader from `three-stdlib`, auto-center and auto-scale model, replace default geometry.

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/preview3d/
git commit -m "feat: add 3D material ball preview with Three.js, STL upload, lighting controls"
```

---

## Phase 9: Mixing + Dashboard UI

### Task 9.1: Mix panel + Dashboard page

**Files:** Create `frontend/src/components/mix/TargetColorPicker.tsx`, `frontend/src/components/mix/MixResultCard.tsx`, `frontend/src/components/mix/MixResultList.tsx`; Modify `frontend/src/pages/DashboardPage.tsx`

- [ ] **Step 1: Create TargetColorPicker**

`TargetColorPicker.tsx`: image upload + Canvas color sampling (same pattern as PhotoColorPicker), optional direct HEX/RGB input, "Compute Mix" button → calls `mixApi.mix()` → populates results.

- [ ] **Step 2: Create MixResultList + MixResultCard**

`MixResultCard.tsx`: displays a single mix candidate with paint name badges (ratio numbers), preview color swatch, ΔE value, "Save as Recipe" button, "Preview in 3D" button.

`MixResultList.tsx`: renders the tricolor reference at top, then candidate cards sorted by ΔE. "Save all as recipe" option.

- [ ] **Step 3: Wire up DashboardPage with 3-panel layout**

`DashboardPage.tsx`: CSS Grid layout with 3 columns:
- Left: PaintList (collapsible)
- Center: Mix panel (TargetColorPicker + MixResultList)
- Right: 3D preview (MaterialBall + controls)

State lifted up for cross-panel communication: mix result color → 3D preview; 3D sampled color → mix target input.

- [ ] **Step 4: Commit**

```bash
git add frontend/
git commit -m "feat: add mixing panel and dashboard with 3-column layout"
```

---

## Phase 10: Color Wheel + Recipe UI

### Task 10.1: ColorWheel component + Recipe pages

**Files:** Create `frontend/src/components/mix/ColorWheel.tsx`, `frontend/src/components/recipe/RecipeList.tsx`, `frontend/src/components/recipe/RecipeCard.tsx`; Create `frontend/src/store/recipeStore.ts`

- [ ] **Step 1: Create ColorWheel**

`ColorWheel.tsx`: HTML5 Canvas rendering HSV wheel (360° hue ring + saturation square). On click, extract HSV → RGB. Show complementary (±180°), triadic (±120°), analogous (±30°). Each color chip has "Set as target" button that sends RGB to TargetColorPicker.

- [ ] **Step 2: Create RecipeList + RecipeCard**

`RecipeList.tsx`: grid of RecipeCards, load from `recipeStore.fetch()`. Each card shows recipe name, preview swatches, date. Click to expand details.

`RecipeCard.tsx`: shows paint names + ratios, target color swatch, delete button.

Create `frontend/src/store/recipeStore.ts`:
```typescript
import { create } from 'zustand';
import { recipesApi } from '../api/recipes';
import type { RecipeRequest, RecipeResponse } from '../types';

interface RecipeState {
  recipes: RecipeResponse[]; loading: boolean;
  fetch: () => Promise<void>;
  save: (r: RecipeRequest) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: [], loading: false,
  fetch: async () => { set({ loading: true }); const res = await recipesApi.list(); set({ recipes: res.data, loading: false }); },
  save: async (r) => { await recipesApi.create(r); await useRecipeStore.getState().fetch(); },
  remove: async (id) => { await recipesApi.delete(id); await useRecipeStore.getState().fetch(); },
}));
```

- [ ] **Step 3: Commit**

```bash
git add frontend/
git commit -m "feat: add color wheel with harmonies and recipe list UI"
```

---

## Phase 11: Docker, CI, Makefile, README

### Task 11.1: CI pipeline + Makefile + README

**Files:** Create `.github/workflows/ci.yml`, `Makefile`, `README.md`; Modify `docker-compose.yml` if needed

- [ ] **Step 1: Create CI workflow**

Create `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  backend-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env: { POSTGRES_USER: minipaint, POSTGRES_PASSWORD: minipaint, POSTGRES_DB: minipaint }
        ports: ["5432:5432"]
        options: --health-cmd pg_isready --health-interval 5s --health-timeout 5s --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '17', distribution: 'temurin' }
      - run: cd backend && mvn test -Dspring.profiles.active=ci
        env: { SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/minipaint, SPRING_DATASOURCE_USERNAME: minipaint, SPRING_DATASOURCE_PASSWORD: minipaint }
  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd frontend && npm ci && npm test
  build:
    needs: [backend-test, frontend-test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -f Dockerfile.backend -t mini-paint-backend .
      - run: docker build -f Dockerfile.frontend -t mini-paint-frontend .
```

- [ ] **Step 2: Create Makefile**

Create `Makefile`:
```makefile
.PHONY: test build run

test:
	cd backend && mvn test -Dspring.profiles.active=dev
	cd frontend && npm test -- --run

build:
	cd backend && mvn package -DskipTests
	cd frontend && npm run build

run:
	docker-compose up --build

stop:
	docker-compose down
```

- [ ] **Step 3: Create README.md**

Create `README.md`:
```markdown
# Miniature Painting Assistant

微缩模型涂装辅助工具 — 录入手头漆色、取目标色、计算混色方案、3D 光影预览。

## Quick Start

```bash
docker-compose up --build
# Frontend: http://localhost
# Backend API: http://localhost:8080/api
```

## Dev

```bash
# Backend
cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Frontend
cd frontend && npm run dev
```

## Test

```bash
make test
```

## Tech Stack

- Backend: Java 17 + Spring Boot 3 + PostgreSQL 16
- Frontend: React 18 + TypeScript + Three.js (React Three Fiber)
- UI Design: Open Design (Dashboard design system)
- Deployment: Docker + docker-compose + GitHub Actions

## Directory Structure

```
backend/     Spring Boot REST API
frontend/    React SPA
docker-compose.yml
Makefile
SPEC.md      Design specification
PLAN.md      Implementation plan
```
```

- [ ] **Step 4: Verify docker-compose build**

Run: `docker-compose build`
Expected: both images build successfully.

- [ ] **Step 5: Final commit**

```bash
git add .github/ Makefile README.md
git commit -m "feat: add CI pipeline, Makefile, and README"
```

---

## Dependency Order

```
Phase 0 (scaffolding) → Phase 1 (auth) → Phase 2 (paints) → Phase 3 (mix engine)
                                                                  ↓
Phase 5 (upload+settings) ← Phase 4 (recipes) ←──────────────────┘
         ↓
Phase 6 (error handling)
         ↓
Phase 7 (frontend auth+pages) → Phase 8 (paint UI) → Phase 9 (dashboard+3D) → Phase 10 (color wheel+recipes UI)
                                                                                       ↓
                                                                              Phase 11 (CI+README)

Parallelizable pairs:
  - Phase 2 (paints backend) ∥ Phase 5 (upload backend)
  - Phase 7 (auth pages) ∥ Phase 8 (paint components) — once API layer done
  - Phase 9 (dashboard) ∥ Phase 10 (color wheel) — independent frontend components
```

---

> **Status:** All phases written. Ready for self-review and handoff.
