const createError = require('http-errors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./models');

const app = express();

app.use(helmet());
app.use(cors());
db.sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

fs.readdir(path.join(__dirname, 'routes'), (err, files) => {
  if (err) return;

  files.forEach(file => {
    const fileName = file.split('.')[0];
    const filePath = `./routes/${fileName}`;
    const route = require(filePath);

    app.use(`/${fileName}`, route);
  })
});

fs.readdirSync(path.join(__dirname, 'routes')).forEach(file => {
  const fileName = file.split('.')[0];
  const filePath = `./routes/${fileName}`;
  const route = require(filePath);

  app.use(`/${fileName}`, route);
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({ error: '잘못된 요청입니다', path: req.path })
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
