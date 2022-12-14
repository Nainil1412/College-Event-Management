var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/register', function (req, res, next) {
	return res.render('register.ejs');
});


router.post('/', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							username: personInfo.username,
							email:personInfo.email,
							role: personInfo.role,
							enroll: personInfo.enroll,
							college: personInfo.college,
							mobile: personInfo.mobile,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are registered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({username:req.body.username},function(err,data){
		if(data){
			
			if(data.password==req.body.password && data.role==req.body.role){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong credentials!"});
			}
		}else{
			res.send({"Success":"This Username Is not registered!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/index');
		}else{
			//console.log("found");
			return res.render('profile.ejs', {"id":data.unique_id,"name":data.username,"email":data.email,"role":data.role});
		}
	});
});

router.get('/event', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/register');
		}else{
			//console.log("found");
			return res.render('eventAdd.ejs', {"id":data.unique_id,"name":data.username,"email":data.email,"role":data.role});
		}
	});
});

router.get('/home', function (req, res, next) {
	// console.log("profile");
	User.findOne(function(err,data){
		// console.log("data");
		// console.log(data);
		return res.render('home.ejs', {"id":data.unique_id,"name":data.username,"email":data.email,"role":data.role});
	});
});

router.get('/home1', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/register');
		}else{
			//console.log("found");
			return res.render('home1.ejs', {"id":data.unique_id,"name":data.username,"email":data.email,"role":data.role});
		}
	});
});

router.get('/about1', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/register');
		}else{
			//console.log("found");
			return res.render('about1.ejs', {"id":data.unique_id,"name":data.username,"email":data.email,"role":data.role});
		}
	});
});

router.get('/contact1', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/register');
		}else{
			//console.log("found");
			return res.render('contact1.ejs', {"id":data.unique_id,"name":data.username,"email":data.email,"role":data.role});
		}
	});
});

// router.get('/home1', function (req, res, next) {
// 	// console.log("profile");
// 	User.findOne(function(err,data){
// 		// console.log("data");
// 		// console.log(data);
// 		return res.render('home1.ejs', {"id":data.unique_id,"name":data.username,"email":data.email,"role":data.role});
// 	});
// });

// router.get('/about1', function (req, res, next) {
// 	// console.log("profile");
// 	User.findOne(function(err,data){
// 		// console.log("data");
// 		// console.log(data);
// 		return res.render('about1.ejs', {"id":data.unique_id,"name":data.username,"email":data.email,"role":data.role});
// 	});
// });

// router.get('/contact1', function (req, res, next) {
// 	// console.log("profile");
// 	User.findOne(function(err,data){
// 		// console.log("data");
// 		// console.log(data);
// 		return res.render('contact1.ejs', {"id":data.unique_id,"name":data.username,"email":data.email,"role":data.role});
// 	});
// });

router.get('/eventView', function (req, res, next) {
	// console.log("profile");
	User.findOne(function(err,data){
		// console.log("data");
		// console.log(data);
		return res.render('eventView.ejs', {"id":data.unique_id,"name":data.username,"email":data.email,"role":data.role});
	});
});

router.get('/logout', function (req, res, next) {
	// console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
			console.log("logout");
    		return res.redirect('/home');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not registered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

module.exports = router;