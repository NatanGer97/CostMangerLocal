var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ejsMate = require('ejs-mate');
var methodOverride = require('method-override')



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var costsRouter = require('./routes/costs');

// mongoose setup
const connectionURI = 'mongodb+srv://Natan:Gershbein@costmanager.dshwg1z.mongodb.net/Project'
// const connectionURI = 'mongodb+srv://Natan:Gershbein@costmanager.dshwg1z.mongodb.net/Project?authSource=admin&replicaSet=atlas-69xwrq-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
const mongoose = require('mongoose')
mongoose.connect(connectionURI);
const db = mongoose.connection;
db.on('error', function() {console.log("Error");});
db.once('open',()=>{console.log("DB Connected");});
// mongoose.connect('mongodb://localhost/CostMangerLocal');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/costs', costsRouter);


app.engine('ejs', ejsMate);


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
