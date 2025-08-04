#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Environment Setup Script
 * 
 * This script helps you set up the correct environment file for development.
 * 
 * Usage:
 *   npm run env:dev     - Use .env.development
 *   npm run env:local   - Use .env.local  
 *   npm run env:prod    - Use .env (production template)
 */

const envFiles = {
  'dev': '.env.development',
  'local': '.env.local',
  'prod': '.env.example'
};

const command = process.argv[2];

if (!command || !envFiles[command]) {
  console.log('Usage:');
  console.log('  node scripts/setup-env.js dev    - Use development environment');
  console.log('  node scripts/setup-env.js local  - Use local environment');
  console.log('  node scripts/setup-env.js prod   - Use production template');
  process.exit(1);
}

const sourceFile = envFiles[command];
const targetFile = '.env';

try {
  if (fs.existsSync(targetFile)) {
    const backup = `.env.backup.${Date.now()}`;
    fs.copyFileSync(targetFile, backup);
    console.log(`Backed up existing .env to ${backup}`);
  }

  fs.copyFileSync(sourceFile, targetFile);
  console.log(`✅ Environment set up successfully!`);
  console.log(`📁 Copied ${sourceFile} to ${targetFile}`);
  console.log(`🚀 You can now run: npm run dev`);

} catch (error) {
  console.error('❌ Error setting up environment:', error.message);
  process.exit(1);
}
