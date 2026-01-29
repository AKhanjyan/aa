#!/usr/bin/env node

/**
 * Check if DATABASE_URL exists and run migrations if available
 * Otherwise, skip migrations (for build environments without DB)
 */

const { execSync } = require('child_process');
const path = require('path');

// Check if DATABASE_URL is set
const hasDatabaseUrl = !!process.env.DATABASE_URL;

if (!hasDatabaseUrl) {
  console.log('⚠️  DATABASE_URL not found, skipping migrations...');
  process.exit(0);
}

try {
  console.log('🔄 Running database migrations...');
  const dbPath = path.join(__dirname, '../../../packages/db');
  
  // Try migrate deploy first
  try {
    execSync('npm run db:migrate:deploy', {
      cwd: dbPath,
      stdio: 'inherit',
    });
    console.log('✅ Migrations deployed successfully');
  } catch (migrateError) {
    console.log('⚠️  Migrate deploy failed, trying db push...');
    try {
      execSync('npm run db:push', {
        cwd: dbPath,
        stdio: 'inherit',
      });
      console.log('✅ Database pushed successfully');
    } catch (pushError) {
      console.log('⚠️  Database operations failed, but continuing build...');
      process.exit(0);
    }
  }
} catch (error) {
  console.log('⚠️  Migration check failed, but continuing build...');
  process.exit(0);
}

