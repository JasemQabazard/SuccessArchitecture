const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const authenticate = require('./authenticate');
const config = require('./config');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const contactRouter = require('./routes/contact');
const socialsRouter = require('./routes/socialsRouter');
const activitiesRouter = require('./routes/activitiesRouter');
const coursesRouter = require('./routes/coursesRouter');
const uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');

var dbURI = config.mongoUrl;
if (process.env.NODE_ENV === "production") {
    dbURI = process.env.MONGODB_URI;
}
const connect = mongoose.connect(dbURI, { useCreateIndex: true, useNewUrlParser: true });

connect.then((db) => {
    console.log("Connected correctly to SuccessArchitecture MONGODB server");
}, (err) => { console.log(err); });

const app = express();

// Secure traffic only

// app.all('*', (req, res, next) => {
//   if (req.secure) {
//     return next();
//   }
//   else {
//     // res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
//     res.redirect('https://' + req.hostname + req.url);
//   }
//  });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contact', contactRouter);
app.use('/socials', socialsRouter);
app.use('/courses', coursesRouter);
app.use('/activities', activitiesRouter);
app.use('/upload', uploadRouter);

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

module.exports = app;
