# User Management System

A modern user management system built with Next.js, Prisma, and TypeScript.

## How to Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/NxSYED-ux/user-management-system.git
   cd user-management-system

2. **Install dependencies**
   ```bash
   npm install

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   Edit .env with your database configuration

4. **Set up Prisma**
   ```bash
   npx prisma generate
   npx prisma db push

5. **Run the development server**
   ```bash
   npm run dev