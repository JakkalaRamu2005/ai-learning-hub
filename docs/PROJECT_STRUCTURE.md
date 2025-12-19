# Project Structure

This document outlines the complete folder and file structure of the AI Learning Hub project.

## Root Directory

```
ai-learning-hub/
├── app/                    # Next.js App Router pages and API routes
├── components/             # Reusable React components
├── config/                 # Configuration files
├── docs/                   # Project documentation
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions, database, and API clients
├── types/                  # TypeScript type definitions
├── .env                    # Environment variables (not in git)
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore rules
├── .prettierignore         # Prettier ignore rules
├── .prettierrc             # Prettier configuration
├── CHANGELOG.md            # Project changelog
├── ENV_SETUP.md            # Environment setup guide
├── README.md               # Project overview
├── eslint.config.mjs       # ESLint configuration
├── middleware.ts           # Next.js middleware
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.mjs      # PostCSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Detailed Structure

### `/app` - Application Pages & API Routes

```
app/
├── api/                    # Backend API routes
│   ├── auth/               # NextAuth.js authentication
│   ├── email-verification/ # Email verification endpoint
│   ├── forgot-password/    # Password reset request
│   ├── learning-modules/   # Learning content API
│   ├── login/              # User login
│   ├── logout/             # User logout
│   ├── profile/            # User profile data
│   ├── register/           # User registration
│   ├── reset-password/     # Password reset
│   ├── resources/          # Free resources API
│   ├── save-tool/          # Save AI tool
│   ├── saved-tools/        # Get saved tools
│   ├── tools/              # AI tools API
│   └── update-profile/     # Update user profile
├── forgot-password/        # Forgot password page
├── learn/                  # Learning curriculum page
├── login/                  # Login page
├── profile/                # User profile page
├── register/               # Registration page
├── reset-password/         # Password reset page
├── resources/              # Free resources page
├── saved-tools/            # Saved tools page
├── tools/                  # AI tools directory page
├── verify-email/           # Email verification page
├── verify-success/         # Verification success page
├── globals.css             # Global styles
├── layout.tsx              # Root layout component
└── page.tsx                # Home page
```

### `/components` - Reusable Components

```
components/
├── resources/              # Resource-specific components
│   ├── FilterTabs.tsx      # Category filter tabs
│   ├── ResourceCard.tsx    # Resource card component
│   └── SearchBar.tsx       # Search input component
├── style/                  # Component-specific styles
│   ├── footer.css
│   ├── forgotpassword.css
│   ├── home.css
│   ├── login.css
│   ├── navbar.css
│   ├── register.css
│   └── resetpassword.css
├── Footer.tsx              # Site footer
├── ForgotPassword.tsx      # Forgot password form
├── Home.tsx                # Home page content
├── Login.tsx               # Login form
├── Navbar.tsx              # Navigation bar
├── NextAuthProvider.tsx    # NextAuth session provider
├── Register.tsx            # Registration form
├── ResetPassword.tsx       # Password reset form
├── ShareModal.tsx          # Social sharing modal
└── ShareModal.css          # Share modal styles
```

### `/lib` - Core Utilities & Backend Logic

```
lib/
├── api/                    # API client utilities
│   ├── services/           # Service layer
│   │   ├── auth.service.ts
│   │   ├── resources.service.ts
│   │   ├── tools.service.ts
│   │   ├── user.service.ts
│   │   └── index.ts
│   ├── client.ts           # API client configuration
│   ├── endpoints.ts        # API endpoint constants
│   └── index.ts
├── db/                     # Database utilities
│   ├── models/             # Mongoose models
│   │   ├── Tool.model.ts   # Tool schema
│   │   ├── User.model.ts   # User schema
│   │   └── index.ts
│   ├── connect.ts          # MongoDB connection
│   └── index.ts
├── utils/                  # Utility functions
│   ├── constants.ts        # App constants
│   ├── format.ts           # Formatting utilities
│   ├── validators.ts       # Validation functions
│   └── index.ts
└── email.ts                # Email sending utilities
```

### `/types` - TypeScript Definitions

```
types/
├── common.types.ts         # Common type definitions
├── next-auth.d.ts          # NextAuth type extensions
├── resource.ts             # Resource types
├── resource.types.ts       # Additional resource types
└── index.ts                # Type exports
```

### `/hooks` - Custom React Hooks

```
hooks/
├── useDebounce.ts          # Debounce hook
├── useLocalStorage.ts      # Local storage hook
├── usePagination.ts        # Pagination hook
├── useTools.ts             # Tools data hook
└── index.ts                # Hook exports
```

### `/config` - Configuration

```
config/
├── env.ts                  # Environment variable validation
├── site.config.ts          # Site configuration
└── index.ts                # Config exports
```

### `/docs` - Documentation

```
docs/
├── ARCHITECTURE.md         # System architecture
├── IMPLEMENTATION_SUMMARY.md
├── QUICK_START.md          # Quick start guide
├── README.md               # Documentation overview
└── REFACTORING.md          # Refactoring notes
```

## Naming Conventions

### Files & Folders
- **Components**: PascalCase (e.g., `Navbar.tsx`, `ShareModal.tsx`)
- **Pages**: lowercase with hyphens (e.g., `forgot-password/`, `verify-email/`)
- **API Routes**: lowercase with hyphens (e.g., `email-verification/`, `update-profile/`)
- **Utilities**: camelCase (e.g., `validators.ts`, `format.ts`)
- **Types**: camelCase with `.types.ts` suffix (e.g., `resource.types.ts`)
- **Styles**: lowercase with extension (e.g., `navbar.css`, `login.css`)

### Code
- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase with `I` prefix for interfaces (e.g., `IUser`, `ITool`)

## Key Features by Directory

### Authentication Flow
- `/app/register` → `/app/api/register` → Email verification
- `/app/verify-email` → `/app/api/email-verification`
- `/app/login` → `/app/api/login`
- `/app/forgot-password` → `/app/api/forgot-password`
- `/app/reset-password` → `/app/api/reset-password`

### Main Features
- **AI Tools**: `/app/tools` + `/app/api/tools`
- **Learning**: `/app/learn` + `/app/api/learning-modules`
- **Resources**: `/app/resources` + `/app/api/resources`
- **Profile**: `/app/profile` + `/app/api/profile` + `/app/api/update-profile`
- **Saved Tools**: `/app/saved-tools` + `/app/api/saved-tools` + `/app/api/save-tool`

## Database Models

### User Model (`lib/db/models/User.model.ts`)
- Authentication (email/password + Google OAuth)
- Profile information (name, bio, place, image)
- Saved tools tracking
- Email verification status

### Tool Model (`lib/db/models/Tool.model.ts`)
- Tool information (name, category, description)
- Pricing model
- External link
- Metadata (weekAdded, createdAt)

## Best Practices

1. **Separation of Concerns**: Pages in `/app`, logic in `/lib`, UI in `/components`
2. **Type Safety**: All types defined in `/types`
3. **Reusability**: Shared hooks in `/hooks`, utilities in `/lib/utils`
4. **API Layer**: Centralized API client in `/lib/api`
5. **Database**: Single source of truth in `/lib/db`
6. **Configuration**: Environment-specific config in `/config`

## Recent Refactoring Changes

### Removed
- ✅ Duplicate database connection file (`lib/db.tsx`)
- ✅ Duplicate model files (`lib/models/`)
- ✅ Empty context folder
- ✅ Lint error files (`lint_errors.txt`, `lint_errors_v2.txt`)
- ✅ Test API route (`app/api/test-db`)

### Renamed
- ✅ `app/forgotpassword` → `app/forgot-password`
- ✅ `app/api/emailverification` → `app/api/email-verification`
- ✅ `app/api/updateprofile` → `app/api/update-profile`

### Improved
- ✅ Consistent naming conventions across the project
- ✅ Removed unused imports
- ✅ Cleaned up empty lines and formatting
- ✅ Updated all references to renamed routes
