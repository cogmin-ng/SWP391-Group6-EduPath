const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const PORT = config.port || 4000;

const server = app.listen(PORT, () => {
  logger.info({ port: PORT }, `Server listening on port ${PORT}`);
});

server.on('error', (error) => {
  logger.error({ error }, 'HTTP server error');
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Promise Rejection');
});

process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught Exception');
});
