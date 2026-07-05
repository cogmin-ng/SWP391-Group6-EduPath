const { spawnSync } = require('child_process');
require('dotenv').config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const args = process.argv.slice(2);
const isGenerate = args.includes('generate');

if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT || !DB_NAME) {
  if (isGenerate) {
    console.warn('Missing database environment variables. Using dummy DATABASE_URL for Prisma generate.');
    process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
  } else {
    console.error('Missing one or more database environment variables (DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME).');
    process.exit(1);
  }
} else {
  // Construct DATABASE_URL for Prisma CLI
  process.env.DATABASE_URL = `postgresql://${DB_USER}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

// Run prisma with the constructed environment variable
const result = spawnSync('npx', ['prisma', ...args], {
  stdio: 'inherit',
  env: process.env,
  shell: true
});

process.exit(result.status);
