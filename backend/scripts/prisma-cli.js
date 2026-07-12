const { spawnSync } = require('child_process');
require('dotenv').config();

if (
  process.env.DATABASE_URL &&
  (!process.env.DB_HOST ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_NAME)
) {
  try {
    const parsedUrl = new URL(process.env.DATABASE_URL);
    if (!process.env.DB_HOST) process.env.DB_HOST = parsedUrl.hostname;
    if (!process.env.DB_PORT) process.env.DB_PORT = parsedUrl.port || '5432';
    if (!process.env.DB_USER) process.env.DB_USER = parsedUrl.username;
    if (!process.env.DB_PASSWORD)
      process.env.DB_PASSWORD = decodeURIComponent(parsedUrl.password);
    if (!process.env.DB_NAME)
      process.env.DB_NAME = parsedUrl.pathname.replace(/^\//, '');
  } catch (err) {
    console.error('Error parsing DATABASE_URL in prisma-cli.js:', err.message);
  }
}

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const args = process.argv.slice(2);
const isGenerate = args.includes('generate');

if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT || !DB_NAME) {
  if (isGenerate) {
    console.warn(
      'Missing database environment variables. Using dummy DATABASE_URL for Prisma generate.'
    );
    process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
  } else {
    console.error(
      'Missing one or more database environment variables (DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME).'
    );
    process.exit(1);
  }
} else {
  // Construct DATABASE_URL for Prisma CLI
  process.env.DATABASE_URL = `postgresql://${DB_USER}:${encodeURIComponent(
    DB_PASSWORD
  )}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

// Run prisma with the constructed environment variable
const result = spawnSync('npx', ['prisma', ...args], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

process.exit(result.status);
