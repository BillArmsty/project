# 📘 GraphQL API Documentation — Journify

This document provides full documentation of the **GraphQL API** for the Journify application.

---

## 🔐 Authentication

- Most queries and mutations require a **valid JWT**.
- JWT should be included as an `Authorization` header:
  ```
  Authorization: Bearer <access_token>
  ```

---

## 📚 Queries

### `whoAmI`
Returns the currently authenticated user's details.
```graphql
query {
  whoAmI {
    id
    email
    role
    createdAt
  }
}
```

---

### `getJournalEntries(limit, page, tags)`
Fetch journal entries for the authenticated user.

```graphql
query {
  getJournalEntries(limit: 10, page: 1, tags: ["travel", "life"]) {
    id
    title
    content
    tags
    category
    createdAt
  }
}
```

---

### `getJournalEntry(id)`
Get a single journal entry by its ID.

```graphql
query {
  getJournalEntry(id: "entry-id-123") {
    title
    content
    tags
    category
  }
}
```

---

### `getAllUserJournals`
Get all journal entries for the current user (no pagination).

---

### `getCategoryDistribution`
Returns the count of entries per category.

---

### `getEntryLengthStats`
Returns average and max word count per entry.

---

### `getJournalHeatmap`
Returns day-wise entry counts for a heatmap visualization.

---

### `getTimeOfDayAnalysis`
Returns hours of the day when journals are written most.

---

### `getWordTrends(limit)`
Returns most common words in entries.

---

## ✍️ Mutations

### `createJournalEntry(data)`
Creates a new journal entry.

```graphql
mutation {
  createJournalEntry(data: {
    title: "My Day",
    content: "It was productive!",
    category: WORK,
    tags: ["productivity", "routine"]
  }) {
    id
    title
  }
}
```

---

### `updateJournalEntry(data)`
Updates an existing journal entry.

```graphql
mutation {
  updateJournalEntry(data: {
    id: "entry-id-123",
    title: "Updated Title",
    content: "New content"
  }) {
    id
    updatedAt
  }
}
```

---

### `deleteJournalEntry(id)`
Deletes an entry by ID.

---

### `analyzeJournal(input)`
AI-powered analysis and summary of journal content.

```graphql
mutation {
  analyzeJournal(input: {
    content: "Today was a great day..."
  }) {
    mood
    sentiment
    summary
  }
}
```

---

## 🧪 Auth Mutations

### `login(input)`
Returns access and refresh tokens.
```graphql
mutation {
  login(loginInput: {
    email: "user@example.com",
    password: "Password123!"
  }) {
    access_token
    refresh_token
    user {
      id
      email
    }
  }
}
```

---

### `register(input)`
Same response as login. Role defaults to USER unless provided.

---

### `refreshToken`
Call to refresh JWTs from the cookie-based refresh token.

---

## 🧑‍💻 Admin Mutations

- `changeUserRole(id, newRole)`
- `changePassword(input)`
- `createUser(createUserInput)`
- `removeUser(id)`

---

## 🧱 Types Overview

### Enums:
- `Category`: PERSONAL, WORK, EDUCATION, TRAVEL, FINANCE, HEALTH, OTHER
- `Role`: USER, ADMIN, SUPERADMIN

### Objects:
- `JournalEntry`, `UserEntity`, `AiResponse`, `LoginResponseDTO`, `RegisterResponseDTO`

---

## ✅ Example Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 🌐 Endpoint

- **GraphQL**: `http://localhost:8080/graphql`
- **AI REST**: `POST /api/analyze`
- **Token Refresh REST**: `GET /auth/refresh-token`