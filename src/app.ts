import express, { Express } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';

import indexRouter from '@routes/index';
import usersRouter from '@routes/user';
import productRouter from '@routes/product';
import adminRouter from '@routes/admin';

import { env } from '@config';
import { errorHandler, serverStatus } from '@middleware';

const app: Express = express();

mongoose.set('strictQuery', false);
mongoose.connect(env.MONGODB_URI!, () => {
  // eslint-disable-next-line no-console
  env.NODE_ENV !== 'production' && console.log('Connected to MongoDB!');
});

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(passport.initialize());
app.use('/status', serverStatus(app));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/product', productRouter);
app.use('/admin', adminRouter);     // :trollface:
app.use('/wp-admin', adminRouter);  // another :trollface:

app.use(errorHandler);

export default app;
