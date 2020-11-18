'use strict';
const path = require('path');
const fs = require('fs');

const express = require('express');
const promBundle = require('express-prom-bundle');
const swagger = require('swagger-tools');
const YAML = require('js-yaml');
const timeout = require('connect-timeout');
const rateLimit = require("express-rate-limit");

// Local includes
const config = require('./lib/config');

const errorMap = {
  ETIMEDOUT: 504
};

module.exports = {
  /**
  * Initializes the main express application. Registers app-wide
  * middleware.
  *
  * @returns {Promise} A promise that resolves to the main express app.
  */
  init() {
    // Create our default app.
    const app = express();

    const swaggerPath = path.join(__dirname, 'api', 'swagger', 'swagger.yaml');
    const swaggerSpec = YAML.safeLoad(fs.readFileSync(swaggerPath, 'utf8'));

    const swaggerInit = new Promise((resolve) => {
      swagger.initializeMiddleware(swaggerSpec, mw => {
        resolve(mw);
      });
    });

    const includeStackTrace = config.get('errors.includeStackTrace');

    return swaggerInit.then(mw => {
      const routerOptions = {
        controllers: './api',
        useStubs: config.get('swagger.router.useStubs'),
      };

      // Register timeout handler
      app.use(timeout('5s'));
      app.use(haltOnTimedout);
      app.use(rateLimit({
        windowMs: 1 * 60 * 1000, // 10 minutes
        max: 5, // limit each IP to 10 requests per windowMs
      }));

      app.use(haltOnTimedout);
      // Add api metrics tracking. Only the routes registered after the express-prom-bundle will be measured
      app.use(promBundle({ includeMethod: true, includePath: true }));
      app.use(haltOnTimedout);
      app.use(mw.swaggerMetadata());
      app.use(haltOnTimedout);
      app.use(mw.swaggerValidator({ validateResponse: config.get('swagger.validator.validateResponse') }));
      app.use(haltOnTimedout);
      app.use(mw.swaggerRouter(routerOptions));
      app.use(haltOnTimedout);
      app.use(mw.swaggerUi());
      app.use(haltOnTimedout);



      // Register 404 response handler
      app.use((req, res) => {
        res.status(404)
          .json({ error: 'The requested endpoint does not exist.' })
          .end();
      });
      app.use(haltOnTimedout);

      // Resister error response handler
      app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars, max-params

        res.status(errorMap[err.code] || 500);

        if (includeStackTrace) {
          res.json({ message: err.message, stack: err.stack });
        }
        else {
          res.json({ message: err.message });
        }
        res.end();
      });
      app.use(haltOnTimedout);

      function haltOnTimedout(req, res, next) {
        if (!req.timedout) {
          next();
        }
      }

      return app;
    });
  },
};
