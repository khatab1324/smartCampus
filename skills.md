# Smart Campus Build Skill

## Purpose

This skill guides AI when implementing the Smart Campus application.

It explains how to build features in a way that matches the project architecture, business rules, and coding style.

---

## 1. Product Summary

Smart Campus is a university attendance app.

Users:

- students
- doctors

Main capabilities:

- authentication
- role-based access
- attendance session creation
- lecture attendance activation
- student check-in
- attendance timestamp storage
- attendance classification as present, late, or absent
- attendance history
- real-time monitoring and filtering

---

## 2. Tech Boundaries

Use only the approved stack unless explicitly told otherwise.

### Backend

- Express.js
- TypeScript
- Firebase Admin SDK
- Firestore

### Mobile

- React Native
- Expo
- TypeScript

### Monorepo

- Turborepo
- npm workspaces

### Shared Packages

- shared types
- shared validation schemas

Do not introduce:

- NestJS
- module architecture
- Prisma
- Sequelize
- TypeORM
- Redux unless truly needed

---

## 3. Backend Build Pattern

Always structure backend features like this:

1. Route
2. Controller
3. Use-case
4. Repository
5. Firebase

### Responsibilities

#### Route

- declare endpoint
- attach middleware
- call controller

#### Controller

- parse request
- pass normalized input to use-case
- format response
- avoid business logic

#### Use-case

- contain the business rule
- validate domain conditions
- coordinate repository calls
- return clear result object

#### Repository

- read and write Firestore
- no HTTP logic
- no response formatting
- no business policy

---

## 4. File Naming Pattern

Use descriptive use-case names.

Examples:

- `login.use-case.ts`
- `get-current-user.use-case.ts`
- `create-lecture.use-case.ts`
- `activate-session.use-case.ts`
- `join-session.use-case.ts`
- `get-attendance-history.use-case.ts`
- `get-late-students.use-case.ts`

Controllers:

- `auth.controller.ts`
- `lecture.controller.ts`
- `attendance.controller.ts`

Repositories:

- `user.repository.ts`
- `lecture.repository.ts`
- `attendance.repository.ts`

---

## 5. Recommended Folder Shape

```txt
apps/api/src/
  index.ts
  app.ts
  config/
    firebase.ts
    env.ts
  routes/
    auth.routes.ts
    lecture.routes.ts
    attendance.routes.ts
  controllers/
    auth.controller.ts
    lecture.controller.ts
    attendance.controller.ts
  use-cases/
    auth/
    lecture/
    attendance/
  repositories/
    user.repository.ts
    lecture.repository.ts
    attendance.repository.ts
  middleware/
    auth.middleware.ts
    error.middleware.ts
    validate.middleware.ts
  types/
```
