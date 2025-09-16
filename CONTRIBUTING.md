# Contributing Guidelines

Thank you for considering contributing to this project!  
To maintain consistency and quality, please follow these guidelines.

---

## 📐 Architecture & Principles

- Follow **Clean Architecture**:
  - Separate **Core**, **Application**, **Infrastructure**, and **Interfaces** layers.
  - Business logic must not depend on frameworks or external services.
  - Boundaries must remain explicit and well-defined.

- Apply fundamental design principles:
  - **KISS** (Keep It Simple, Stupid) → Avoid unnecessary complexity.
  - **SOLID** → Ensure maintainable, extensible, and testable code.
  - **DRY** (Don't Repeat Yourself) → Reuse abstractions, avoid duplication.
  - **High Cohesion & Low Coupling** → Each module should do one thing well and depend minimally on others.
  - **Use interfaces** to define contracts and decouple implementations.

- Encourage the use of **Design Patterns** when applicable:  
  Reference: [Refactoring Guru - Design Patterns](https://refactoring.guru/design-patterns)

---

## 🌳 Branching Strategy

We follow a **two-main-branch workflow**:

- `main` → Always stable, reflects production-ready code.
- `develop` → Integration branch, where all features, fixes, and chores are merged before reaching `main`.

### 🔧 Rules

- Always branch **from `develop`** when starting new work.
- Use prefixes to classify branches:
  - `feat/*` → New features  
  - `fix/*` → Bug fixes  
  - `chore/*` → Maintenance tasks (dependencies, configs, etc.)  
  - `refactor/*` → Code improvements without new features  
  - `docs/*` → Documentation updates  

### 🌐 Example Workflow

1. Create a new branch from `develop`:  

   ```sh
   git checkout develop
   git pull
   git checkout -b feat/authentication
