# Overview

This is a comprehensive full-stack enterprise web application called "STAR Solutions" that provides a software solutions business platform with advanced role-based functionality. The application features dual authentication systems, integrated ticketing through Zammad, subscription management, and admin functions for customer approval and application link management.

## Key Features Integrated (January 8, 2025)

### **Authentication System**
- **Dual Login Flow**: Customer authentication via PostgreSQL database, Employee authentication via Active Directory (PAM/SSSD)
- **Customer Registration**: Email/password with admin approval workflow
- **Session Management**: Express sessions with PostgreSQL persistence
- **Role-Based Access**: Customer, Employee, and Admin roles with different permissions

### **Zammad Integration**
- **Full Ticketing System**: Integration with Zammad server at `10.171.132.90:3000`
- **Customer Support**: Customers can create, view, and track support tickets
- **Employee Ticket Management**: Full ticket management for employees and admins
- **Automatic User Creation**: Creates Zammad customers automatically
- **Ticket Synchronization**: Maps between internal and Zammad ticket formats

### **Customer Features**
- **Ticket Portal**: Create and manage support tickets through Zammad integration
- **Profile Management**: Company information and contact details
- **Dashboard**: Personal overview of tickets and account status

### **Employee Features**
- **Application Links**: Quick access to internal tools (Prometheus, Wazuh, Calendar, Documentation)
- **Advanced Ticket Management**: Full ticket system with priority, status, and assignment
- **Admin Functions**: Customer approval, application link management
- **AD Authentication**: System-level authentication with fallback test users

### **Database Schema**
- **users**: Customer accounts with approval workflow
- **ad_users**: Employee accounts from Active Directory
- **tickets**: Support tickets with Zammad integration
- **application_links**: Internal application quick access
- **sessions**: Authentication session management

### **Demo Data**
- Admin user: admin@starsolutions.ca / admin123
- Demo customer: customer@example.com / customer123
- Test employees: john.doe, jane.smith, admin (all password123)
- Sample tickets for testing ticket system functionality

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/build tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: TailwindCSS with custom CSS variables for theming
- **Routing**: Wouter for client-side routing with protected route components
- **State Management**: TanStack React Query for server state and custom auth context
- **Form Handling**: React Hook Form with Zod schema validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints with JSON responses
- **Authentication**: Session-based auth with dual login flows (AD for employees, traditional for customers)
- **Database Integration**: Drizzle ORM with connection pooling via Neon serverless
- **Password Security**: bcrypt for customer password hashing
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple

## Database Design
- **Primary Database**: PostgreSQL with Drizzle ORM schema management
- **Core Tables**: 
  - `users` table with polymorphic user types (employee/customer)
  - `sessions` table for authentication session management
- **Schema Migrations**: Drizzle Kit for database schema versioning and deployment

## Authentication & Authorization
- **Dual Authentication System**: 
  - Active Directory integration for employees (using activedirectory2 package)
  - Email/password authentication for customers
- **Session Management**: Cookie-based sessions with PostgreSQL persistence
- **Role-Based Access**: Route protection based on user type (employee/customer/admin)
- **Password Security**: bcrypt hashing for customer accounts, AD delegation for employees

# External Dependencies

## Third-Party Services
- **Zammad Integration**: Ticketing system integration at `http://10.171.132.90:5432`
  - Employee access to full Zammad interface
  - Customer portal integration with embedded iframe
- **Active Directory**: On-premise AD server integration for employee authentication
  - Server configuration via `AD_SERVER` environment variable
  - Base DN configuration for LDAP queries

## Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database with connection pooling
- **Connection Management**: `@neondatabase/serverless` for optimized database connections

## UI/Component Libraries
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **TailwindCSS**: Utility-first CSS framework with custom design system

## Development Tools
- **Replit Integration**: Development environment plugins for live preview and debugging
- **TypeScript**: Strong typing across full stack
- **Vite**: Fast development server and build tool with hot module replacement