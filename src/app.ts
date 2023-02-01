import express, { Express } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';

import indexRouter from '@routes/index';
import usersRouter from '@routes/user';

import config from '@config';
import { errorHandler } from '@middleware';

const app: Express = express();

mongoose.connect(config.MONGODB_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(errorHandler);

module.exports = app;
