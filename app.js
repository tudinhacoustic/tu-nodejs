var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//Express HBS Templating
var expressHbs = require('express-handlebars');
//Mongoose
var mongoose = require('mongoose');
//Session
var session = require('express-session');
//Passport
var passport = require('passport');
var flash = require('connect-flash');
//Validator
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

//Connect MongoDB
mongoose.connect('mongodb://tuacoustic:Curveruler0312@ds153380.mlab.com:53380/tuacoustic');
require('./config/passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
//Custom templating
app.engine('.hbs',expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Để sau bodyparser
app.use(validator());
app.use(cookieParser());
app.use(session({
	secret: 'mysupersecret', 
	resave: false, 
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection}),
	cookie: { maxAge: 30 * 60 * 1000 }
}));
app.use(flash());
//Middleware được gọi ở từng request, kiểm tra session lấy ra passport.user nếu chưa có thì tạo rỗng
app.use(passport.initialize());
//Middleware sử dụng kịch bản passport, sử dụng session lấy thông tin user rồi gắn vào req.user
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//Xét người dùng tồn tại
app.use(function(req, res, next){
	
	res.locals.session = req.session;
	if(req.session.username == 'admin'){
		res.locals.admin = req.isAuthenticated();
	}
	else{
	res.locals.login = req.isAuthenticated();
	}
	
	next();
});

//URL
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter);

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

//Starting Count HBS Template
var Handlebars = require('handlebars');
Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
//End----------------------------

module.exports = app;
