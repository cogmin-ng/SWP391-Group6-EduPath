const pino = require('pino');

if (process.env.NODE_ENV === 'development') {
  // simple console-based logger in dev to avoid pino transport issues
  module.exports = {
    info: (...args) => console.log(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
    debug: (...args) => console.debug(...args),
  };
} else {
  module.exports = pino();
}
