# Supabase Functions Guide

This guide explains the different types of functions and operations we use with Supabase in a simple way.

## Types of Files

### 1. Migrations

-   These are files that help set up and update the database structure
-   Written in SQL
-   Used for:
    -   Creating new tables
    -   Adding or changing columns
    -   Updating database functions
    -   Setting up security rules
    -   Making sure everyone's database looks the same
-   Example: Adding a new 'last_login' column to the users table
    ```sql
    -- Add new column to users table
    ALTER TABLE users
    ADD COLUMN last_login TIMESTAMP;
    ```

Use **Migrations** when:

-   You're setting up new features that need database changes
-   You need to update the database structure
-   You want to make sure all developers have the same database setup

**Note**: When pulling new code changes, make sure you run `npm run db:reset` to apply all database migrations or run `npm run db:migrate` to apply only new migrations

### 2. Database Functions (managed within migration operations)

-   These are functions that run directly in the database
-   Written in PostgreSQL (SQL language)
-   Best for:
    -   Complex data calculations
    -   Data validation
    -   Automatic data updates
    -   Tasks that need to be very fast
-   Example: Automatically calculating a user's total points when they complete a quest

    ```sql
    -- Create Database Function
    CREATE FUNCTION calculate_user_points(user_id UUID)
    RETURNS INTEGER AS $$
    SELECT SUM(points)
    FROM user_activities
    WHERE user_id = $1;
    $$ LANGUAGE SQL;
    ```

    ```typescript
    // Call the function
    supabase.rpc.('calculate_user_points', { user_id: 123 })
    ```

Use **Database Functions** when:

-   You need to work directly with the data
-   Speed is very important
-   The task is mostly about reading or writing data

**Note**: When creating a Database Function, make sure you:

-   Create the function in a migration file under `supabase/migrations`
-   Add its type definition to the `Functions` interface in `types/supabase.ts`

### 3. Edge Functions

-   These are like mini serverless APIs that run on servers close to the user
-   Written in TypeScript/JavaScript
-   Best for:
    -   Connecting to other services (like sending emails)
    -   Complex logic that's hard to do in SQL
    -   Tasks that need to use external APIs
    -   Processing data before saving to database
-   Example: Sending a welcoming email when a user joins the app

    ```typescript
    // Create Edge Function
    serve(async (email: string, name: string) {
    	const emailService = new EmailService();
    	await emailService.send({
    		to: email,
    		subject: "Welcome!",
    		body: `Hi ${name}, welcome to our app!`,
    	});
    });

    // Call the function
    supabase.functions.invoke("welcomeEmail", {
    	body: { email: "john.doe@gmail.com", name: "John" },
    });
    ```

**Note**: When creating a Database Function, make sure you:

-   Create the function in `supabase/edge-functions/<function_name>/index.ts`
-   Deploy the function to Supabase using `supabase functions deploy [function-name]`
-   Enable the function and configure any environment variables needed in the Supabase Dashboard, you need

Use **Edge Functions** when:

-   You need to connect to other services
-   You need to use npm packages
-   You want to run more complex JavaScript/TypeScript code
-   You need to process files or images
