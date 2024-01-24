# Task list
A place to store all your tasks.

## Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Input Validation**: Zod
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth
- **State Management**: Recoil
- **UI Libraries**: NextUI, Shadcn UI, Flowbite and Tailwind CSS

## Installation

1. Clone the repository: `git clone https://github.com/DarkWolff71/Task-List.git`
2. Create .env and .env.local files:
    - `cd Task-List`
    - `vim .env.local` // populate it referring .env.local.sample
    - `vim prisma/.env` // populate it referring prisma/.env.sample
3. Install dependencies: `pnpm install`
3. Set up the database and configure environmental variables.
4. Generate the prisma client: `pnpm dlx prisma migrate dev --name init`
5. Run the application: `pnpm run dev`
  
