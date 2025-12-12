# Call Log & WhatsApp Messenger

## Overview

A mobile-first web application for managing call logs with direct WhatsApp messaging integration. Users can add call log entries (incoming, outgoing, missed calls) and quickly send WhatsApp messages to contacts. Built with a React frontend and Express backend using a monorepo structure.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Forms**: React Hook Form with Zod validation
- **Design System**: Material Design 3 inspired, mobile-first approach with 44px minimum touch targets

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful JSON API under `/api` prefix
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Static file serving from built assets

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - shared between client and server
- **Validation**: Zod schemas generated from Drizzle tables via `drizzle-zod`
- **Storage**: Currently uses in-memory storage (`MemStorage` class) with interface ready for database implementation

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/   # UI components
│       ├── pages/        # Route pages
│       ├── hooks/        # Custom React hooks
│       └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   └── storage.ts    # Data storage interface
├── shared/           # Shared code between client/server
│   └── schema.ts     # Database schema and types
└── migrations/       # Drizzle database migrations
```

### Key Design Decisions
- **Monorepo with shared types**: Schema definitions in `shared/` ensure type safety across client and server
- **Storage abstraction**: `IStorage` interface allows swapping between in-memory and database implementations
- **Mobile-first UI**: All components designed for touch interfaces with appropriate spacing and sizing

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migrations and schema management

### Third-Party Services
- **WhatsApp Web**: Integration via `wa.me` deep links for message composition (no API required)

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `drizzle-orm` / `drizzle-zod`: Database ORM and schema validation
- `express`: HTTP server framework
- `wouter`: Client-side routing
- `react-hook-form`: Form handling
- `date-fns`: Date formatting utilities
- `lucide-react` / `react-icons`: Icon libraries