const { check, validationResult } = require('express-validator/check');
var util = require('util')
var passport = require('passport');
var User = require('../models/user')
var Product = require('../models/product');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

var salt = 10;
//Check Validation
//const { check, validationResult } = require('express-validator/check');


//Hàm được gọi khi xác thực thành công công để lưu thông tin User vào session
passport.serializeUser(function(user, done){
	done(null, user.id);
});
//Hàm được gọi bởi passport.session giúp ta lấy dữ liệu User dựa vào thông tin lưu trên session và gắn vào req.user
passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	})
});
passport.use('local.signin',new LocalStrategy({
	//usernameField:'username',
	//passwordField: 'password',
	passReqToCallback:true},
	function(req,username, password, done){
		req.checkBody('username', 'Username phải lớn hơn 3 kí tự').isLength({min:3});
		req.checkBody('username', 'Username phải bé hơn 16 kí tự').isLength({max:16});
		var errors = req.validationErrors();
		if(errors){
			var messages = [];
			errors.forEach(function(error){
				messages.push(error.msg);
			});
			return done(null, false, req.flash('error', messages));
		}
		var errors = validationResult(req);
		if(errors){
			
		}
		User.findOne({name: username}, function(err, user){
			if(err){return done(err);}
			//if(!user){return done(null, false, {message: 'Tên truy cập không tồn tại'});}
			if(!user){
				return done(null, false, {message: 'Tên truy cập không tồn tại'});
			}
			var hash = user.password;
			bcrypt.compare(password, hash, function(err, response){
				if(response == true){
					req.session.username = user.name;
					return done(null, user, {idSession: user.name});
				}else{
					return done(null, false, {message: 'Sai tài khoản hoặc mật khẩu'});
				}
			});
		});
	}
));

//Passport Authenticate Register
passport.use('local.register', new LocalStrategy({
	passReqToCallback: true
},
		function(req, username, password, done){
			//Username
			req.checkBody('username', 'Username không được để trống').notEmpty();
			req.checkBody('username', 'Username phải có ít nhất 3 kí tự').isLength({min:3});
			req.checkBody('username', 'Username không chứa quá 16 kí tự').isLength({max:16});
			//Password
			req.checkBody('password', 'Password không được để trống').notEmpty();
			req.checkBody('password', 'Password phải lớn hơn 3 kí tự').isLength({min:3});
			req.checkBody('password2', 'Nhập lại Password sai').equals(req.body.password);
			req.checkBody('password', 'Re-Password không được để trống').notEmpty();
			var errors = req.validationErrors();
			if(errors){
				var messages = [];
				errors.forEach(function(error){
					messages.push(error.msg);
				});
				return done(null, false, req.flash('error', messages));
			}
			User.findOne({name: username}, function(err, user){
				if(err){return done(err);}
				if(user){
					return done(null,false,{message: 'Tên truy cập đã tồn tại'});
				}
				var newUser = new User();
				newUser.name = username;
				newUser.password = newUser.encryptPassword(password);
				newUser.save(function(err, result){
					if(err){
						return done(err);
					}
					req.session.username = newUser.name;
					return done(null,newUser);
				})
			});
				

		}
));


//Authenticate Admin
passport.use('local.admin', new LocalStrategy({

	passReqToCallback: true,
},
		function(req, username, password,  done){
			//Username
			req.checkBody('username', 'Username không được để trống').notEmpty();
			req.checkBody('username', 'Username phải có ít nhất 3 kí tự').isLength({min:3});
			req.checkBody('username', 'Username không chứa quá 16 kí tự').isLength({max:16});
			//Password
			req.checkBody('password', 'Password không được để trống').notEmpty();
			req.checkBody('password', 'Password phải lớn hơn 3 kí tự').isLength({min:3});
			req.checkBody('password2', 'Nhập lại Password sai').equals(req.body.password);
			req.checkBody('password2', 'Password2 không được bỏ trống').notEmpty();
			var errors = req.validationErrors();

			if(errors){
				var messages = [];
				errors.forEach(function(error){
					messages.push(error.msg);
				});
				return done(null, false, req.flash('error', messages));
			}
			User.findOne({name: username}, function(err, user){
				if(err){return done(err);}
				if(user){
					return done(null,false,{message: 'Tên truy cập đã tồn tại'});
				}
				var newUser = new User();
				newUser.name = username;
				newUser.password = newUser.encryptPassword(password);
				newUser.save(function(err, result){
					if(err){
						return done(err);
					}
					//req.session.username = newUser.name;
					return done(null,newUser);
				})
			});
				

		}
));



