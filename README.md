# 📌 CodeLink

**CodeLink** is a backend platform that allows developers to create and share their portfolio-like profile, including their tech stack, skills, and notable projects.
The main idea is that anyone can **publicly browse developer profiles** via a **well-designed API**, while each dev can securely manage their information through authentication.

> ⚡ **All backend and API development must be done using BunJS**, taking advantage of its speed and TypeScript support.

---

## 🎯 Project Goals

* Centralize developer profiles in a **public API**.
* Provide developers a space to showcase:

  * Their tech stack.
  * Main skills.
  * Relevant projects.
* Provide a secure authentication system so users can keep their portfolio up-to-date.
* Design a **modular and scalable backend**, independent of the frontend (React, SolidJS, mobile apps, etc).

---

## 🏗️ Architecture

The project follows **clean architecture principles**, separating layers to keep the code maintainable and scalable.

### 🔹 Main Technologies

* **Runtime / Development:** [BunJS](https://bun.sh/) ⚡
* **Backend Framework:** [HonoJS](https://hono.dev/)
* **Language:** TypeScript
* **Database / ORM:** [TursoDB](https://turso.tech/) + Prisma
* **Authentication:** JWT with refresh token rotation
* **Cache / Sessions:** Redis
* **Validations:** Zod
* **Dependency Injection:** tsyringe
* **Logger:** pino (configurable)

> TursoDB is a distributed database that provides scalability and performance. Prisma is used as the ORM for mapping entities and handling migrations.

### 🔹 Core Modules

* **Users:** registration, login, basic profile.
* **Profiles:** tech stack, skills, and projects.
* **Auth:** login with JWT, refresh tokens, secure sessions.
* **Shared:** common utilities (logger, Result, error handling, etc).

---

## 🚦 Authentication Flow

1. **Login** → generates `accessToken` + `refreshToken`.
2. **AccessToken** → used in private calls (short-lived).
3. **RefreshToken** → allows requesting new tokens.
4. **Secure Rotation** → regenerating tokens creates a new session and revokes the old one.

---

## 📡 Endpoints (initial example)

```http
POST /auth/register   → Create account
POST /auth/login      → Login
POST /auth/refresh    → Rotate tokens
GET  /profiles/:id    → View public profile
GET  /profiles        → List profiles
PUT  /profiles/me     → Update my profile (auth required)
```

---

## ⚙️ Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/SammyBytes/CodeLink.git
cd CodeLink
```

### 2. Install dependencies

```bash
bun install
```

### 3. Environment variables

Create a `.env` file based on `.env.example`:

```env
# TursoDB
TURSO_DATABASE_URL="your_turso_url"
TURSO_AUTH_TOKEN="your_auth_token"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="super-secret"
```

### 4. Configure Prisma with TursoDB

```prisma
generator client {
  provider        = "prisma-client-js"
  output          = "../src/generated/prisma"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### 5. Migrations

```bash
bunx prisma migrate dev
```

In production, apply SQL scripts directly in TursoDB as per the [official documentation](https://docs.turso.tech/sdk/ts/orm/prisma).

### 6. Start server

```bash
bun run dev
```

Server running at `http://localhost:3000 🚀`.

---

## 🤝 Contributions

Contributions are welcome! Typical steps:

1. Fork the repo.
2. Make changes in a new branch (`feature/my-feature`).
3. Open a PR describing the improvement or fix.

---

## 📌 Roadmap

* [x] Basic JWT authentication.
* [x] Session management with Redis.
* [ ] CRUD for developer profiles.
* [ ] Public API with filters (stack, skills, projects).
* [ ] Automated tests (unit + integration).
* [ ] OpenAPI/Swagger documentation.
* [ ] CI/CD pipeline.

---

## 📄 License

MIT License. Free to use and modify.
