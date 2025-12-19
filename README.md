# AI Learning Hub

Welcome to the AI Learning Hub! This is a comprehensive platform designed to help anyone learn about Artificial Intelligence easily. We provide curated free resources, learning paths, AI tools directory, and personalized learning experiences.

## ✨ Key Features

### **Core Features**
*   **AI Tools Directory:** Curated collection of 120+ AI tools with filtering, search, and save functionality
*   **Free Resources:** 250+ free AI courses, books, newsletters, and practice platforms
*   **Learning Modules:** 180+ step-by-step video tutorials organized by skill level
*   **User Accounts:** Secure authentication with email verification and password reset
*   **Profile System:** Manage personal details, bio, and saved tools
*   **Social Sharing:** Share tools and resources across multiple platforms

### **Technical Features**
*   **Modern Architecture:** Clean, scalable codebase following industry best practices
*   **Type Safety:** Comprehensive TypeScript coverage with strict mode
*   **API Client Layer:** Centralized API calls with error handling
*   **Custom Hooks:** Reusable React hooks for common functionality
*   **Responsive Design:** Beautiful UI that works on mobile, tablet, and desktop
*   **Dark Mode:** Switch between light and dark themes
*   **Performance Optimized:** Pagination, lazy loading, and efficient data fetching

## 🛠️ Technologies Used

*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript 5
*   **Styling:** Tailwind CSS 4 + Custom CSS Modules
*   **Database:** MongoDB with Mongoose ODM
*   **Authentication:** NextAuth.js
*   **Email:** Nodemailer
*   **Validation:** Zod
*   **Data Source:** Google Sheets API (for resources)
*   **Code Quality:** ESLint + Prettier

## 📁 Project Structure

```
my-app/
├── app/                    # Next.js App Router pages and API routes
├── components/             # React components
├── config/                 # Configuration files (env, site config)
├── hooks/                  # Custom React hooks
├── lib/
│   ├── api/               # API client and services
│   ├── db/                # Database connection and models
│   └── utils/             # Utility functions and constants
├── types/                 # TypeScript type definitions
└── docs/                  # Documentation
```

For detailed architecture information, see [REFACTORING.md](./docs/REFACTORING.md)

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- Gmail account for email functionality (optional)

### **Installation**

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd my-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    ```bash
    cp .env.example .env
    ```
    Then edit `.env` with your actual values:
    - `MONGO_URI`: Your MongoDB connection string
    - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
    - `EMAIL_*`: Your email configuration
    - Other optional variables

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open in browser:**
    Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

- **[Refactoring Guide](./docs/REFACTORING.md)**: Detailed explanation of the codebase refactoring
- **[Environment Setup](./ENV_SETUP.md)**: Environment variables configuration guide

## 🧪 Code Quality

```bash
# Run linter
npm run lint

# Format code with Prettier
npx prettier --write .
```

## 🏗️ Architecture Highlights

### **API Client Layer**
Centralized API calls with type safety:
```typescript
import { toolsService } from '@/lib/api/services';

const { tools } = await toolsService.getAll();
```

### **Custom Hooks**
Reusable logic extraction:
```typescript
import { useTools, usePagination } from '@/hooks';

const { tools, loading, toggleSaveTool } = useTools();
```

### **Type Safety**
Comprehensive TypeScript interfaces:
```typescript
import type { Tool, Resource } from '@/types';
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database
- All open-source contributors

---

**Made with ❤️ for AI learners worldwide**

*Happy Learning!*

