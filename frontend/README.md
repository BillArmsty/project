

## 🧪 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/BillArmsty/project.git
cd project/frontend
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Setup environment variables

Create `.env`:

```env
NEXTAUTH_SECRET=mysecret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_GRAPHQL_API=http://localhost:8080/graphql
NEXT_PUBLIC_OPENAI_API_KEY=mykey

```


### 4. Start the  server

```bash
yarn next build
yarn start
```