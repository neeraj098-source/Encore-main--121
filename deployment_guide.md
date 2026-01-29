# Deployment Guide for Encore 26

This guide explains how to deploy updates (both frontend code and database changes) to the live server running at `encore.ietlucknow.ac.in`.

## Prerequisites

- SSH access to the server.
- The project is already set up and running with PM2 under the name `encore`.
- You have pushed your latest local changes to the GitHub repository.

## Deployment Steps

### 1. Connect to the Server
SSH into your server:
```bash
ssh <username>@<server-ip>
# Example: ssh ubuntu@123.45.67.89
```

### 2. Navigate to the Project Directory
Go to the folder where the `encore26` project is located:
```bash
cd /path/to/encore26
# Verify you are in the right place
ls
```

### 3. Pull Latest Changes
Fetch the latest code from the git repository:
```bash
git pull origin main
```
*If there are merge conflicts, you will need to resolve them, but usually, on the production server, you just want to mirror the main branch.*

### 3.5 Update Environment Variables
Since `.env` is not in git, you must manually update it on the server to match your production domain:
```bash
nano .env
# Change NEXTAUTH_URL=http://localhost:3000 to NEXTAUTH_URL=https://encore.ietlucknow.ac.in
# Save and exit (Ctrl+O, Enter, Ctrl+X)
```


### 4. Install Dependencies (If needed)
If you added new packages to `package.json`, install them:
```bash
npm install
```

### 5. Update the Database (If needed)
If you made changes to the `prisma/schema.prisma` file (like adding new models or fields), you need to apply these changes to the production database:

**Generate Prisma Client:**
```bash
npx prisma generate
```

**Push Schema Changes:**
```bash
npx prisma db push
```
*Note: `db push` is often safer for rapid iteration than `migrate deploy` if you are not strictly using migration files, but ensure it doesn't warn about data loss.*

### 6. Build the Application
Rebuild the Next.js application to reflect frontend and backend changes:
```bash
npm run build
```

### 7. Restart the Application
Restart the PM2 process to serve the new build:
```bash
pm2 restart encore
```

### 8. Verify Deployment
Check the logs to ensure everything started correctly:
```bash
pm2 logs encore
```
Visit `https://encore.ietlucknow.ac.in` to verify the site is up and running.

## Quick Cheat Sheet
Combine these commands for a standard update:

```bash
cd /path/to/encore26
git pull origin main
npm install
npx prisma generate
npx prisma db push
npm run build
pm2 restart encore
```
