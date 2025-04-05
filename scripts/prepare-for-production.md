# Preparing Your Next.js Application for Production

This guide will help you prepare your application for production deployment.

## 1. Cleaning Up Development Files

We've provided two scripts to help you clean up development files:

- For Windows: `./scripts/cleanup-dev-files.ps1`
- For Unix-based systems: `node ./scripts/cleanup-dev-files.js`

**Windows PowerShell Usage:**
```powershell
# First list the files that will be removed
./scripts/cleanup-dev-files.ps1 -Mode List

# Create a backup of important files
./scripts/cleanup-dev-files.ps1 -Mode Backup

# Clean up the development files
./scripts/cleanup-dev-files.ps1 -Mode Clean
```

**Unix/Node.js Usage:**
```bash
# Make the script executable
chmod +x ./scripts/cleanup-dev-files.js

# Run the script
./scripts/cleanup-dev-files.js
```

## 2. Setting Up Production Environment Variables

Create a `.env.production` file with your production environment variables:

```
# Supabase connection
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# Google OAuth for production
# Add appropriate production URLs to your Google OAuth settings
```

## 3. Building for Production

Build your Next.js application for production:

```bash
# Using npm
npm run build

# Using yarn
yarn build

# Using pnpm
pnpm build
```

## 4. Files to Keep for Production

The following files and directories are essential for production:

- `app/` - Your application code
- `components/` - React components
- `contexts/` - React contexts
- `hooks/` - React hooks
- `lib/` - Utility functions and libraries
- `public/` - Static assets
- `styles/` - CSS and style files
- `types/` - TypeScript type definitions
- `supabase/` - Supabase configuration
- `middleware.ts` - Next.js middleware
- `next.config.mjs` - Next.js configuration
- `package.json` - Project dependencies
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS configuration

## 5. Deployment Options

### Vercel (Recommended for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel
```

### Other Hosting Providers
Most hosting providers will accept the output of `npm run build`, which creates a `.next` directory with your production-ready application.

## 6. CI/CD Considerations

For continuous integration and deployment, consider:

1. Setting up GitHub Actions or another CI/CD pipeline
2. Automating the build and deployment process
3. Implementing proper testing before deployment
4. Setting up environment-specific configuration

---

Remember to test your production build locally before deploying by running:

```bash
# Build the application
npm run build

# Start the production server locally
npm start
``` 