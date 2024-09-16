import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import reviewsRouter from './routes/reviews.js';

import {userLink} from "./helpers.js"

const app = express();

// view engine setup
app.set('views', join(import.meta.dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(import.meta.dirname, 'public')));
app.use(cookieSession({
  name: 'session',
  keys: [process.env['COOKIE_SECRET_KEY']],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

/*
// Uncomment below to enable a content security policy
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy',"default-src 'self'")
  next()
})
*/

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/reviews', reviewsRouter);

app.locals.userLink = userLink

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
