# Contributing Guide

Thank you for your interest in contributing to AI Learning Hub! This guide will help you understand our development workflow and coding standards.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Project Structure](#project-structure)
5. [Testing](#testing)
6. [Submitting Changes](#submitting-changes)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JakkalaRamu2005/nextjstypescript.git
   cd ai-learning-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables (see `ENV_SETUP.md` for details)

4. **Run the development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `refactor/*` - Code refactoring

### Creating a New Feature

1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [Code Standards](#code-standards)

3. Test your changes thoroughly

4. Commit with descriptive messages:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. Push and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Standards

### TypeScript

- **Always use TypeScript** - No `.js` or `.jsx` files
- **Define types explicitly** - Avoid `any` unless absolutely necessary
- **Use interfaces for objects** - Prefix with `I` (e.g., `IUser`, `ITool`)
- **Export types** - Make types reusable from `/types` directory

Example:
```typescript
// ✅ Good
interface IUserProfile {
  name: string;
  email: string;
  bio?: string;
}

const updateProfile = (data: IUserProfile): Promise<void> => {
  // implementation
}

// ❌ Bad
const updateProfile = (data: any) => {
  // implementation
}
```

### React Components

- **Use functional components** with hooks
- **Use TypeScript** for props
- **Follow naming conventions**:
  - Components: `PascalCase`
  - Files: `PascalCase.tsx`
  - Props interfaces: `ComponentNameProps`

Example:
```typescript
// ✅ Good
interface NavbarProps {
  isLoggedIn: boolean;
  userName?: string;
}

export default function Navbar({ isLoggedIn, userName }: NavbarProps) {
  return <nav>{/* ... */}</nav>;
}

// ❌ Bad
export default function navbar(props: any) {
  return <nav>{/* ... */}</nav>;
}
```

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `Navbar.tsx`, `ShareModal.tsx` |
| Pages | lowercase-with-hyphens | `forgot-password/`, `verify-email/` |
| API Routes | lowercase-with-hyphens | `email-verification/`, `update-profile/` |
| Utilities | camelCase | `validators.ts`, `formatDate.ts` |
| Types | camelCase.types.ts | `resource.types.ts`, `common.types.ts` |
| Styles | lowercase.css | `navbar.css`, `login.css` |
| Hooks | useCamelCase.ts | `useDebounce.ts`, `usePagination.ts` |

### Code Formatting

We use **Prettier** for code formatting:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

**Prettier Configuration** (`.prettierrc`):
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "useTabs": false
}
```

### Linting

We use **ESLint** for code quality:

```bash
npm run lint
```

Fix common issues:
- Remove unused imports
- Fix missing dependencies in `useEffect`
- Ensure proper TypeScript types

### API Routes

- **Use proper HTTP methods**: GET, POST, PUT, DELETE
- **Return consistent responses**:
  ```typescript
  // Success
  return NextResponse.json({ 
    message: "Success message",
    data: result 
  }, { status: 200 });

  // Error
  return NextResponse.json({ 
    message: "Error message",
    error: errorDetails 
  }, { status: 400 });
  ```

- **Always connect to DB first**:
  ```typescript
  import { connectDB } from "@/lib/db";
  
  export async function POST(request: Request) {
    await connectDB();
    // ... rest of the code
  }
  ```

- **Use proper error handling**:
  ```typescript
  try {
    await connectDB();
    // ... logic
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
  ```

### Database Models

- **Use Mongoose schemas** in `/lib/db/models/`
- **Add validation** at the schema level
- **Create indexes** for frequently queried fields
- **Export typed models**

Example:
```typescript
import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
}, { timestamps: true });

// Add indexes
UserSchema.index({ email: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
```

### CSS Styling

- **Co-locate styles** with components when possible
- **Use semantic class names**: `.navbar-container`, `.login-form`
- **Avoid inline styles** unless dynamic
- **Use CSS variables** for theme colors

Example:
```css
/* ✅ Good */
.navbar-container {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
}

.navbar-link {
  color: var(--primary-color);
  text-decoration: none;
}

/* ❌ Bad */
.nav {
  display: flex;
}

.a {
  color: blue;
}
```

## Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed information about the folder organization.

### Key Directories

- `/app` - Next.js pages and API routes
- `/components` - Reusable React components
- `/lib` - Core utilities, database, API clients
- `/types` - TypeScript type definitions
- `/hooks` - Custom React hooks
- `/config` - Configuration files

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] All pages load without errors
- [ ] Forms submit correctly
- [ ] API endpoints return expected responses
- [ ] Authentication flow works (login, register, logout)
- [ ] Responsive design on mobile and desktop
- [ ] No console errors or warnings

### Running the App

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## Submitting Changes

### Pull Request Process

1. **Update documentation** if you changed APIs or added features
2. **Test thoroughly** - Ensure no breaking changes
3. **Write clear PR description**:
   - What changed?
   - Why was it changed?
   - How to test it?

4. **PR Title Format**:
   - `feat: Add new feature`
   - `fix: Fix bug description`
   - `refactor: Improve code structure`
   - `docs: Update documentation`
   - `style: Format code`

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project standards
- [ ] Self-reviewed the code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No console errors
- [ ] Tested on multiple browsers
```

## Common Patterns

### Fetching Data

```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  async function fetchData() {
    try {
      const res = await fetch("/api/endpoint");
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result.data);
    } catch (err) {
      setError("Error loading data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
```

### Form Handling

```typescript
const [formData, setFormData] = useState({ name: "", email: "" });
const [message, setMessage] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const res = await fetch("/api/endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      setMessage(data.message || "Error occurred");
      return;
    }
    
    setMessage("Success!");
  } catch (error) {
    setMessage("Something went wrong");
  }
};
```

## Need Help?

- Check existing [documentation](./docs/)
- Review [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- Look at similar existing code
- Ask questions in PR comments

## Code of Conduct

- Be respectful and constructive
- Help others learn and grow
- Write clean, maintainable code
- Document your changes
- Test before submitting

Thank you for contributing to AI Learning Hub! 🚀
