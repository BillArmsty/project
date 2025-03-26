# ✨ Journify – Transform Your Thoughts into Beautiful Stories

Journify is a fullstack AI-powered journaling platform that allows users to create, manage, and analyze personal journal entries. It features rich role-based access, dark/light theming, AI suggestions, and insightful analytics — all backed by robust testing and modular architecture.

---

## 🔍 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Testing Strategy](#testing-strategy)
- [Error Handling](#error-handling)
- [Performance Optimizations](#performance-optimizations)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)


---

## 🌟 Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access with `USER`, `ADMIN`, and `SUPERADMIN` roles
- Session-less stateless auth using Passport and GraphQL context

### 👥 Role Capabilities
- **User**: Register, login, create/view/edit/delete journals
- **Admin**: View all users and their journals, delete journals
- **SuperAdmin**: All admin powers + change user roles

### ✍️ Journaling Experience
- Rich journal editor with markdown support
- Predefined categories (`WORK`, `PERSONAL`, etc.)
- Tag-based filtering and search
- AI content suggestions using Hugging Face models

### 🎨 Theming & UI
- Toggle between Light and Dark mode from the settings page
- Responsive modern UI using `styled-components`

### 📊 Journal Analytics
- Word count trends
- Journal frequency calendar (heatmap)
- Category distribution pie charts

---

## 🧱 Architecture

```
.
├── backend/
│   ├── auth/
│   ├── journal/
│   ├── users/
│   ├── ai/
│   ├── prisma/
│   └── main.ts
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── utils/
│   │   └── styles/
│   └── public/
```

- **NestJS GraphQL (Apollo Driver)** with code-first schema
- **PostgreSQL with Prisma** ORM
- **Next.js (App Router)** frontend with theme context
- **AI Integration** via Hugging Face's `@huggingface/inference`

---

## ✅ Testing Strategy

### Unit Tests
- Services, resolvers, strategies, and guards
- Dependency injection with mocks (Jest)

### Integration Tests
- GraphQL resolver logic and service composition
- Prisma interactions mocked

### E2E Tests
- User auth, CRUD flows, and analytics assertions
- Token injection and access protection

```bash
yarn test         # Run all unit/integration tests
yarn test:e2e     # Run end-to-end tests
```

All tests mock third-party APIs (like Hugging Face) for consistency and reliability.

---

## 🛡️ Error Handling

- Centralized logging via `Logger`
- Custom error messages and GraphQL extensions
- Fallback for AI errors
- Graceful handling of token expiration and invalid access

---

## ⚡ Performance Optimizations

- SWC compiler in Next.js frontend for fast builds
- Prisma query optimizations
- Memoized React hooks and minimal re-renders
- Debounced interactions for filtering
- Smart module loading (transformIgnorePatterns for specific libs)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- `.env` configuration

### Setup

```bash
# Backend
cd backend
yarn
npx prisma generate
yarn start:dev

# Frontend
cd frontend
yarn
yarn dev
```

### Environment Variables

```env
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/journify
JWT_SECRET=supersecret
HUGGINGFACE_API_KEY=your_huggingface_token
```

---

## 🛠️ Tech Stack

| Layer        | Technology               |
|--------------|---------------------------|
| Backend      | NestJS, GraphQL (Apollo)  |
| Frontend     | Next.js (App Router)      |
| Auth         | Passport.js (JWT)         |
| ORM          | Prisma                    |
| Database     | PostgreSQL                |
| AI           | Hugging Face Inference API|
| Styling      | styled-components         |
| Testing      | Jest, Supertest           |

---



## 🧠 Future Improvements

- Journal edit history
- Mobile app (React Native)
- i18n for multilingual support
- 2FA for enhanced security
- Better AI analysis: mood, tone, sentiment classification

---


