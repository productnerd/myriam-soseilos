# Welcome to Afterhours!

## Project info

**URL**: https://lovable.dev/projects/7ff5be37-9084-42f7-8be1-56dba3fb4b7a

## Getting Started

**Use Lovable**: Simply visit the [Lovable Project](https://lovable.dev/projects/7ff5be37-9084-42f7-8be1-56dba3fb4b7a) and start prompting.
Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**: If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

1. Clone the repository (git clone <YOUR_GIT_URL>)
2. Install dependencies: `npm install`
3. Set up environment variables:
    - Create a `.env` file at the root level of the project
    - Fill in your environment variables (Syntax: VARIABLE_NAME=VALUE):
        - `VITE_SUPABASE_URL`: Your Supabase project URL
        - `VITE_SUPABASE_ANON_KEY`: Your Supabase project's anon/public key
4. Run `npm run db:reset` to apply all database migrations (or run `npm run db:migrate` to apply only new migrations)
5. Start the development server: `npm run dev`

(The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

## Environment Variables

The project uses environment variables for managing sensitive configuration. These are handled differently depending on the context:

-   **Frontend**: Uses `.env` file for local development (never commit this file)
-   **Edge Functions**: Secrets are managed through Supabase Dashboard
    (These are serverless functions that on Supabase's infrastructure in a Deno environment - can be found in `./supabase/functions/`)
-   **Production**: Set environment variables in your deployment platform

## Database Changes

1. Create a new migration file in `./supabase/migrations`
2. Follow the naming convention: `migration_*.sql`
3. Test changes locally before deployment

# Deployment

Simply open [Lovable](https://lovable.dev/projects/7ff5be37-9084-42f7-8be1-56dba3fb4b7a) and click on Share -> Publish.
Remember to set up your environment variables in your deployment platform!
