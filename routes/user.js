var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var User = require('../models/user');


//Token Protection
var csrfProtection = csrf();
router.use(csrfProtection);

//Cho profile trước router.use(notLoggedIn) để xác định người dùng đã đăng nhập
//Profile
router.get('/profile.html', isLoggedIn,function(req, res, next){
		User.findOne({name: req.session.username}, function(err, docs){
			if(err) throw err;
			res.render('user/profile',{users: docs});
		});
});
//Logout
router.get('/logout.html', isLoggedIn ,function(req, res, next){
	req.logout();
	res.render('user/logout',{title: 'Logout'});
})
router.use('/', notLoggedIn, function(req, res, next){
	next();
});
//Login
router.get('/signin.html',function(req,res,next){
	var messages = req.flash('error');
	res.render('user/signin', {title: 'Login', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});

//POST Login
router.post('/signin.html',passport.authenticate('local.signin', {failureFlash: true, successRedirect:'profile.html', failureRedirect:'signin.html'}));


//Register

//GET
router.get('/register.html', function(req, res, next){
	var messages = req.flash('error');
	res.render('user/register', {title: 'register', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});
//POST
router.post('/register.html',passport.authenticate('local.register',{failureFlash: true, successRedirect: 'profile.html', failureRedirect:'register.html'}));


//VD SESSION
router.get('/session', function(req,res,next){
	req.session.username = "Đinh Nguyễn Cẩm Tú";
	var name = req.session.username;
	console.log(name);
	res.render('user/session', {title: 'session', csrfToken: req.csrfToken(), username: req.session.username})
});



//Xác thực người dùng(bảo mật Middle Ware)
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.send('Bạn chưa đăng nhập');
	//res.redirect('/');
}
//Nếu người dùng đã đăng nhập rồi
function notLoggedIn(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.send('Bạn đang đăng nhập');
}

module.exports = router;
