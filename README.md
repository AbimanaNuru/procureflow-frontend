# ProcureFlow Frontend

> A modern, enterprise-grade procurement management system built with React, TypeScript, and Vite.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646cff.svg)](https://vitejs.dev/)

## 📋 Overview

ProcureFlow is a comprehensive procurement management system designed to streamline and automate the entire procure-to-pay process. The frontend application provides an intuitive interface for managing procurement requests, purchase orders, approvals, vendors, and AI-powered document processing.

### Key Features

- 🔐 **Secure Authentication** - JWT-based authentication with automatic token refresh
- 📝 **Request Management** - Create, track, and manage procurement requests with multi-level approval workflows
- 📄 **Purchase Orders** - Generate and manage purchase orders with vendor integration
- 🤖 **AI Document Processing** - Automated proforma extraction and receipt validation using AI
- 👥 **User Management** - Role-based access control with granular permissions
- 📊 **Dashboard & Analytics** - Real-time insights into procurement activities
- ⚙️ **Approval Configuration** - Dynamic approval workflows based on amount thresholds
- 🎨 **Modern UI/UX** - Built with shadcn/ui components and Tailwind CSS
- 🌙 **Dark Mode** - Full theme support with system preference detection
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Core Framework
- **[React 18.3](https://reactjs.org/)** - UI library for building component-based interfaces
- **[TypeScript 5.8](https://www.typescriptlang.org/)** - Type-safe JavaScript for enhanced developer experience
- **[Vite 7.2](https://vitejs.dev/)** - Next-generation frontend build tool for fast development

### UI & Styling
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality, accessible React components built on Radix UI
- **[Lucide React](https://lucide.dev/)** - Beautiful, consistent icon library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management with dark mode support

### State Management & Data Fetching
- **[TanStack Query (React Query) 5.83](https://tanstack.com/query/latest)** - Powerful data synchronization and caching
- **[React Hook Form 7.61](https://react-hook-form.com/)** - Performant form validation
- **[Zod 3.25](https://zod.dev/)** - TypeScript-first schema validation

### Routing & Navigation
- **[React Router DOM 6.30](https://reactrouter.com/)** - Declarative routing for React applications

### HTTP Client
- **[Axios 1.13](https://axios-http.com/)** - Promise-based HTTP client with interceptors

### Additional Libraries
- **[date-fns](https://date-fns.org/)** - Modern date utility library
- **[Recharts](https://recharts.org/)** - Composable charting library for React
- **[Sonner](https://sonner.emilkowal.ski/)** - Opinionated toast notifications

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd procureflow-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Application Configuration (Optional)
VITE_APP_NAME=ProcureFlow
VITE_ENV=development
```

**Environment Variables Explained:**

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000/api` | Yes |
| `VITE_APP_NAME` | Application display name | `ProcureFlow` | No |
| `VITE_ENV` | Environment identifier | `development` | No |

> **Note:** All Vite environment variables must be prefixed with `VITE_` to be exposed to the client-side code.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
procureflow-frontend/
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── procureflow.png
│   └── placeholder.svg
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Layout.tsx       # Page layout wrapper
│   │   ├── ProtectedRoute.tsx
│   │   ├── PermissionGuard.tsx
│   │   └── ...
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication state
│   ├── hooks/               # Custom React hooks
│   │   ├── use-auth.ts      # Authentication hooks
│   │   ├── use-user.ts      # User management hooks
│   │   ├── use-request.ts   # Request management hooks
│   │   ├── use-ai-request.ts # AI processing hooks
│   │   └── ...
│   ├── lib/                 # Utilities and configurations
│   │   ├── api-client.ts    # Axios instance with interceptors
│   │   ├── validations.ts   # Zod schemas
│   │   └── utils.ts         # Helper functions
│   ├── pages/               # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── RequestList.tsx
│   │   ├── PurchaseOrderList.tsx
│   │   ├── Users.tsx
│   │   └── ...
│   ├── services/            # API service layer
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── request.service.ts
│   │   ├── approval.service.ts
│   │   └── ...
│   ├── types/               # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── request.types.ts
│   │   └── index.ts
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment template
├── Dockerfile               # Docker configuration
├── nginx.conf               # Nginx configuration for production
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md
```

## 🔌 API Integration

The frontend communicates with the ProcureFlow backend API. The API client is configured in `src/lib/api-client.ts` with the following features:

- **Automatic Token Injection** - JWT tokens are automatically added to request headers
- **Token Refresh** - Expired access tokens are automatically refreshed using refresh tokens
- **Error Handling** - Centralized error handling with user-friendly messages
- **Request/Response Interceptors** - Custom logic for authentication and error handling

### API Base URL

The API base URL is configured via the `VITE_API_URL` environment variable. Ensure your backend is running and accessible at this URL.

### Authentication Flow

1. User logs in via `/login` page
2. Backend returns access and refresh tokens
3. Tokens are stored in `localStorage`
4. Access token is included in all subsequent API requests
5. When access token expires, the refresh token is used to obtain a new access token
6. If refresh fails, user is redirected to login

## 🏗️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development environment |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

### Code Quality

The project uses ESLint for code quality and consistency. Run linting before committing:

```bash
npm run lint
```

### Adding New Components

When adding new shadcn/ui components:

```bash
npx shadcn@latest add <component-name>
```

Example:
```bash
npx shadcn@latest add button
```

## 🐳 Docker Deployment

### Building the Docker Image

```bash
docker build \
  --build-arg VITE_API_URL=https://your-backend-api.com/api \
  -t procureflow-frontend .
```

### Running the Container

```bash
docker run -p 80:80 procureflow-frontend
```

The application will be available at `http://localhost`

### Docker Configuration

The Dockerfile uses a multi-stage build:

1. **Build Stage** - Compiles the Vite application with environment variables
2. **Production Stage** - Serves static files using Nginx

Environment variables must be passed as build arguments (`--build-arg`) during the Docker build process, as Vite embeds them at build time.

## 🚢 Production Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Platforms

The application can be deployed to various platforms:

#### Render
1. Connect your GitHub repository
2. Set environment variables in the Render dashboard
3. Render will automatically build and deploy using the Dockerfile

#### Vercel / Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables

#### Traditional Server (Nginx)
1. Build the application: `npm run build`
2. Copy `dist/` contents to your web server
3. Configure Nginx to serve the static files and handle client-side routing

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/procureflow/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔒 Security Considerations

- **Environment Variables** - Never commit `.env` files or expose sensitive data
- **API Keys** - Do not store API keys in `VITE_*` variables (they're exposed in the client bundle)
- **Authentication** - Tokens are stored in `localStorage` (consider `httpOnly` cookies for enhanced security)
- **CORS** - Ensure backend CORS configuration allows requests from your frontend domain

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes and commit: `git commit -m "Add your feature"`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For issues, questions, or contributions, please contact the development team or open an issue in the repository.

---

**Built with ❤️ by the ProcureFlow Team**
