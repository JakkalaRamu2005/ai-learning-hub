# 🚀 Quick Start Guide

## For New Developers

Welcome to the AI Learning Hub codebase! This guide will help you get started quickly.

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or cloud instance)
- **Git**
- **Code Editor** (VS Code recommended)

## ⚡ Quick Setup (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd my-app

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` with your values:

```env
# Minimum required for local development
MONGO_URI=mongodb://localhost:27017/ai-learning-hub
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-min-32-chars-generate-with-openssl-rand-base64-32
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NODE_ENV=development
APP_URL=http://localhost:3000
```

### 3. Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Common Tasks

### Adding a New Feature

1. **Create API Service** (if needed)
   ```typescript
   // lib/api/services/myfeature.service.ts
   import { apiClient } from "../client";
   
   export const myFeatureService = {
     getData: () => apiClient.get("/api/myfeature"),
   };
   ```

2. **Create Custom Hook** (if needed)
   ```typescript
   // hooks/useMyFeature.ts
   import { useState, useEffect } from "react";
   import { myFeatureService } from "@/lib/api/services";
   
   export function useMyFeature() {
     const [data, setData] = useState([]);
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       myFeatureService.getData()
         .then(setData)
         .finally(() => setLoading(false));
     }, []);
     
     return { data, loading };
   }
   ```

3. **Use in Component**
   ```typescript
   // components/MyFeature.tsx
   import { useMyFeature } from "@/hooks";
   
   export function MyFeature() {
     const { data, loading } = useMyFeature();
     
     if (loading) return <div>Loading...</div>;
     
     return <div>{/* Your UI */}</div>;
   }
   ```

### Formatting Code

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Running Linter

```bash
npm run lint
```

## 📁 Where to Find Things

| What you need | Where to look |
|--------------|---------------|
| API calls | `lib/api/services/` |
| Custom hooks | `hooks/` |
| Utility functions | `lib/utils/` |
| Type definitions | `types/` |
| Database models | `lib/db/models/` |
| Configuration | `config/` |
| Components | `components/` |
| Pages | `app/` |

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run format:check     # Check formatting

# Database (if using local MongoDB)
mongod                   # Start MongoDB
```

## 💡 Pro Tips

### 1. Use Path Aliases

```typescript
// ❌ Don't do this
import { User } from "../../lib/db/models/User.model";

// ✅ Do this
import { User } from "@/lib/db/models";
```

### 2. Use API Services

```typescript
// ❌ Don't do this
const res = await fetch("/api/tools");
const data = await res.json();

// ✅ Do this
import { toolsService } from "@/lib/api/services";
const { tools } = await toolsService.getAll();
```

### 3. Use Custom Hooks

```typescript
// ❌ Don't do this
const [tools, setTools] = useState([]);
useEffect(() => { /* fetch logic */ }, []);

// ✅ Do this
import { useTools } from "@/hooks";
const { tools, loading } = useTools();
```

### 4. Use Utilities

```typescript
// ❌ Don't do this
const slug = text.toLowerCase().replace(/\s+/g, "-");

// ✅ Do this
import { toSlug } from "@/lib/utils";
const slug = toSlug(text);
```

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: Please define the MONGO_URI environment variable
```

**Solution:** Check your `.env` file has `MONGO_URI` set correctly.

### Module Not Found Error

```
Cannot find module '@/lib/api/services'
```

**Solution:** Restart your dev server (`Ctrl+C` then `npm run dev`)

### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

## 📚 Learn More

- [Full Documentation](./REFACTORING.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Changelog](../CHANGELOG.md)

## 🆘 Getting Help

1. Check the documentation in `docs/`
2. Look at existing code for examples
3. Ask the team in your communication channel

## ✅ Ready to Code!

You're all set! Start by exploring the codebase:

1. Look at `app/page.tsx` - Home page
2. Check `hooks/useTools.ts` - Example custom hook
3. Review `lib/api/services/tools.service.ts` - Example API service
4. Explore `components/` - UI components

Happy coding! 🎉
