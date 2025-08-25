# SecureAuth API

## Overview

SecureAuth API is a full-stack web application that provides secure user authentication and authorization functionality. The application is built with a React frontend using shadcn/ui components and an Express.js backend with PostgreSQL database integration. It features a complete authentication system with user registration, login, JWT token management, and a dashboard interface for authenticated users. The application also includes comprehensive API documentation and follows modern web development best practices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite as the build tool
- **UI Library**: shadcn/ui components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **API Design**: RESTful API with centralized error handling and logging middleware

### Data Storage
- **Database**: PostgreSQL with Neon Database serverless integration
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Data Validation**: Zod schemas shared between frontend and backend for consistent validation

### Authentication & Authorization
- **Password Security**: bcrypt with 12 salt rounds for secure password hashing
- **Token Management**: JWT tokens with configurable expiration (24h default)
- **Authorization Middleware**: Custom middleware for protecting authenticated routes
- **Session Management**: Token-based authentication stored in localStorage on client-side

### Project Structure
- **Monorepo Layout**: Shared schema and types between client and server
- **Client Directory**: Contains React frontend application with UI components
- **Server Directory**: Contains Express.js backend with routes and middleware
- **Shared Directory**: Contains common schemas and type definitions

### Development & Build Tools
- **Development Server**: Vite with HMR for frontend, tsx for backend development
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Type Checking**: TypeScript with strict mode enabled across the entire codebase
- **Code Quality**: Path aliases for clean imports and consistent code organization

## External Dependencies

### Database & Storage
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect

### Authentication & Security
- **bcrypt**: Password hashing and salt generation
- **jsonwebtoken**: JWT token creation and verification
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used)

### Frontend Libraries
- **Radix UI**: Unstyled, accessible UI components foundation
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Wouter**: Lightweight client-side routing
- **date-fns**: Date manipulation utilities

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library with design system
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Utility for creating component variants

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing with Tailwind CSS
- **Replit Integration**: Development environment integration tools