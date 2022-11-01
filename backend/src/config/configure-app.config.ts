import { INestApplication, RequestMethod } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { ExceptionHandler } from '../utils/exceptions';
import * as helmet from 'helmet';
import { ValidationHandler } from '../pipes';
import { setupSwagger } from './swagger/swagger';
import appConfiguration from './app.config';

export const configureApp = (app: INestApplication) => {
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  if (process.env.NODE_ENV === 'Private' || process.env.NODE_ENV === 'local') {
    app.enableCors();
  } else {
    const config = appConfiguration();
    const origin = `${config.app.originName}`;
    app.enableCors({ methods: 'GET', origin });
  }

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET');
    next();
  });

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // Swagger will not be available publicly
  if (process.env.NODE_ENV === 'Private' || process.env.NODE_ENV === 'local') setupSwagger(app);

  // Global error handler
  app.useGlobalFilters(new ExceptionHandler());

  // Global validation handler
  app.useGlobalPipes(new ValidationHandler());

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'script-src': ["'self'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'upgrade-insecure-requests': [],
        'Strict-Transport-Security': 'max-age=31536000',
      },
    }),
    helmet.frameguard({ action: 'deny' }),
    helmet.xssFilter(),
    helmet.hidePoweredBy()
  );
};
