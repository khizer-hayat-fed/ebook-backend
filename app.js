var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Static Imports
require("dotenv").config();
const database = require("./database/index.js");
const cors = require("cors");

var indexRouter = require('./routes/index');

var app = express();
const server = require("http").createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const corsOptions = {
  origin: ["http://localhost:3001", "http://localhost:3000"], // Replace with your frontend's URL
  credentials: true, // Enable credentials (cookies, authorization headers)
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.urlencoded({ limit: "10gb", extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "public")));

// Static imports of routes
const userModule = require("./user");
const productModule = require('./product');
const profileModule = require('./profile');
const adminModule = require('./admin');
const shopModule = require('./shop');
const categoryModule = require('./category')
const orderModule = require('./order')
const reviewModule = require('./review')


app.use('/', indexRouter);
app.use('/api/users', userModule);
app.use('/api/products', productModule);
app.use('/api/profiles', profileModule);
app.use('/api/admin', adminModule);
app.use('/api/shop', shopModule);
app.use('/api/category', categoryModule)
app.use('/api/order', orderModule)
app.use('/api/review', reviewModule)


app.options("*", cors(corsOptions));
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

server.listen(5000, () => {
  console.log(`Server is running on port ${5000}`);
  try {
    database(); // Wait for the database connection to be established
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
});

module.exports = app;
