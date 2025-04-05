#!/usr/bin/env node

/**
 * This script removes files and directories that are not needed in production.
 * Run this script before deployment to clean up your project.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files and directories to be removed (relative to project root)
const devFilesToRemove = [
  '.git',
  '.gitignore',
  'tmp',
  'SUPABASE_QUERIES.md',
  'GOOGLE_AUTH_SETUP.md',
  'learning_paths_sql_queries.sql',
  '.env.example',
  'docker-compose.yml',
  'scripts/supabase-setup.sql',
  'scripts/minimal-setup.sql',
  'scripts/create-test-function.sql',
  'scripts/create-get-tables-function.sql',
  'scripts/create-learning-tables.sql',
  'scripts/manage-compiler.ts',
  'scripts/cleanup-dev-files.js', // This script will remove itself
];

// First create a backup of package.json to preserve the production dependencies
try {
  console.log('Creating backup of package.json...');
  fs.copyFileSync('package.json', 'package.json.backup');
} catch (err) {
  console.error('Error creating backup of package.json:', err);
  process.exit(1);
}

// Function to safely remove a file or directory
function safeRemove(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`${filePath} does not exist, skipping...`);
    return;
  }
  
  try {
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      console.log(`Removing directory: ${filePath}`);
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      console.log(`Removing file: ${filePath}`);
      fs.unlinkSync(fullPath);
    }
    
    console.log(`Successfully removed: ${filePath}`);
  } catch (err) {
    console.error(`Error removing ${filePath}:`, err);
  }
}

// Main cleanup function
function cleanupDevFiles() {
  console.log('Starting cleanup of development files...');
  
  // Remove each file/directory in the list
  devFilesToRemove.forEach(file => {
    safeRemove(file);
  });
  
  console.log('Cleanup completed!');
  console.log('');
  console.log('Note: To prepare for production, you should also:');
  console.log('1. Run `npm run build` or `yarn build` to create a production build');
  console.log('2. Set proper environment variables for production');
  console.log('3. Consider using a CI/CD pipeline for automated deployments');
}

// Execute the cleanup
cleanupDevFiles(); 