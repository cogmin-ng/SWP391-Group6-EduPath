const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const config = require('./config');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();

const corsOptions = {
  origin:
    config.nodeEnv === 'development'
      ? true
      : (origin, callback) => {
          const allowed =
            !origin ||
            config.cors.origins.includes('*') ||
            config.cors.origins.includes(origin);

          callback(allowed ? null : new Error('Not allowed by CORS'), allowed);
        },
  credentials: true,
  exposedHeaders: ['Content-Disposition'],
};

// Swagger UI uses inline scripts, so keep it outside Helmet's default CSP.
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (config.nodeEnv === 'development') app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
