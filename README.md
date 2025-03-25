# 🧠 Journaling App Backend – README

This document contains everything you need to run, understand, and contribute to the backend of the Journaling App, built with **NestJS**, **GraphQL**, **Prisma**, and **PostgreSQL**.

---

## 🚀 Tech Stack

| Component          | Tool/Library              |
|--------------------|---------------------------|
| Backend Framework  | NestJS                    |
| Language           | TypeScript                |
| ORM                | Prisma                    |
| Database           | PostgreSQL                |
| API Type           | GraphQL (mostly), REST    |
| Auth               | JWT + Guards + Role-based |
| Dev Tools          | Yarn, ESLint, Prettier    |

---

## 📦 Monorepo Structure

```
/root
 ├── /backend     # (NestJS app)
 └── /frontend    # (Next.js app)
```

---

## 📡 Running the Backend

### ✅ Development Server

```bash
cd backend
yarn install
yarn start:dev
```

### 🧪 Running Tests

```bash
# Unit Tests
yarn test

# End-to-End Tests
yarn test:e2e
```

---

## 🔐 Authentication Strategy

- **JWT-based** stateless auth using `@nestjs/passport`
- `JwtStrategy`, `JwtAuthGuard`, and `RolesGuard` control access
- `@CurrentUser()` decorator injects user payload
- Next.js frontend protects routes with **middleware-based auth**
- Separate **refresh token** endpoint served via REST for efficiency

---

## 🧱 Data Model Design

```prisma
model User {
  id        String         @id @default(uuid())
  email     String         @unique
  password  String
  role      Role           @default(USER)
  entries   JournalEntry[]
  createdAt DateTime       @default(now())
}

model JournalEntry {
  id        String   @id @default(uuid())
  title     String
  content   String
  tags      Tag[]    @relation("EntryTags")
  category  Category
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Tag {
  id      String         @id @default(uuid())
  name    String         @unique
  entries JournalEntry[] @relation("EntryTags")
}

enum Role {
  USER
  ADMIN
  SUPERADMIN
}

enum Category {
  PERSONAL
  WORK
  TRAVEL
  HEALTH
  FINANCE
  EDUCATION
  OTHER
}
```

---

## 🔒 Security Beyond Auth

- Passwords hashed with `bcrypt`
- Guarded GraphQL mutations by roles (`@Roles()` decorator)
- Rate-limiting via middleware (optional at scale)
- Input validation via `class-validator`
- XSS prevention via sanitation pipes (optional for user-generated content)

---

## 📈 Scaling for 1M+ Users

### ✅ Potential Challenges
- Query resolution time with deeply nested GraphQL
- Tag-based filtering at scale
- AI model inference cost/delay under load

### 🛠 Solutions
- Enable **DataLoader** or field-level caching
- Paginate all journal queries
- Move AI service to a queue-based system (e.g., BullMQ)
- Use CDN for static AI-generated content
- Add Redis for caching user sessions and stats

### 🔄 Redesign Candidates
- Move AI inference to async job workers
- Split GraphQL schema into microservices
- Batch journal update pipelines for tagging
- Implement GraphQL federation or REST fallback

---

## 📜 API Documentation

### 🔷 GraphQL Endpoint
```
POST /graphql
```

Includes:
- `createJournalEntry(data)`
- `updateJournalEntry(data)`
- `deleteJournalEntry(id)`
- `getJournalEntries(tags?, pagination?)`
- `analyzeJournal(input)`
- `getJournalStats`

### 🔷 REST Endpoints

#### POST `/ai/analyze`
Analyzes journal text using Hugging Face model.

```json
{ "content": "Today I felt amazing..." }
```

#### GET `/auth/refresh`
Returns new access token from refresh token cookie.

---

## 🧠 Technical Decision Log

### 1. **GraphQL over REST**
- **Problem**: Avoid overfetching/underfetching journals/tags
- **Options**: REST vs GraphQL
- **Decision**: Use GraphQL for journals, REST for simple auth/AI
- **Trade-off**: More complexity in resolver setup

### 2. **Tags as Related Model**
- **Problem**: Users want to tag journals flexibly
- **Options**: Inline array vs separate `Tag` model
- **Decision**: Normalize tags as many-to-many
- **Trade-off**: Slightly complex mutation logic

### 3. **Separate AI Endpoint**
- **Problem**: GraphQL doesn't suit file streaming or timeout-prone models
- **Options**: Inline vs separate REST route
- **Decision**: Use REST for AI analysis
- **Trade-off**: One extra route, but simplified response flow

### 4. **Admin Role-Based Access**
- **Problem**: Prevent normal users from accessing `/admin`
- **Options**: Client-only check vs server+client
- **Decision**: Use both middleware and backend `RolesGuard`
- **Trade-off**: Extra checks, but secure across layers

---

## ⚙️ Setup Instructions

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/journals
JWT_SECRET=your_secret
```

### Database Setup

```bash
yarn prisma migrate dev

```

### Running Server

```bash
yarn start:dev
```

---

## ✅ Example Queries

```graphql
mutation {
  createJournalEntry(data: {
    title: "Hello World",
    content: "This is a test",
    category: PERSONAL,
    tags: ["test", "intro"]
  }) {
    id
  }
}

query {
  getJournalEntries {
    id
    title
    tags
  }
}
```

---
