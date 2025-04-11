// import csurf from 'csurf';
// app.use(csurf({ cookie: true }));

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import xssClean from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import logger from './core/config/logger.js';
import errorHandler from './core/middlewares/errorMiddleware.js';
import notFound from './core/middlewares/notFound.js'; 
import { globalLimiter } from './lib/limit.js';
import appRouter from './core/app/index.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(xssClean());
app.use(mongoSanitize());
app.use(morgan('combined'));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(globalLimiter);

app.use('/api', appRouter); 

app.use(notFound);       
app.use(errorHandler);

logger.info('Middleware stack initialized');

export default app;

