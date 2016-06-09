var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var sysuserModel = require('../models/sysuserModel');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sysuserController = require('../controllers/sysuserController')

/* GET home page. */
router.get('/',isLogedIn,function(req, res, next) {
  res.render('index');
});

router.post('/',function(req, res, next) {
  res.render('index');
});

router.get('/login',function(req,res,next){
  //req.flash('sucess_msg','infotest')
  //res.render('./contents/login',{sucess_msg:req.flash('sucess_msg')});
  res.render('./contents/login');
});

//登陆验证
router.post('/login',passport.authenticate('local',{successRedirect:'/',failureRedirect:'/login',failureFlash:true}),
    function(req, res) {
     res.redirect('/'); 
  });

router.get('/register',function(req,res,next){
  res.render('./contents/register');
});

router.post('/register',checkRegForm,function(req,res,next){
  console.log('通过表单验证')
  //创建用户账号
  var user = {
    username:req.body.username,
    psd:req.body.password1
  }
  sysuserController.createUser(user,function(err,result){
    console.log(result);
  });//创建用户
  
});

//表单验证中间件
function checkRegForm(req,res,next) {
    console.log(req.body);
  var username = req.body.username;
  var password1 = req.body.password1;
  var password2 = req.body.password2;
  
  req.checkBody('username','用户名不可为空').notEmpty();
  req.checkBody('password1','密码不可为空').notEmpty();
  req.checkBody('password2','请重复输入密码').notEmpty();
  
  var errors = req.validationErrors();
  
  if(errors){
    console.log('注册表单有错')
    res.render('./contents/register',{errors:errors});
  }else{
    console.log('表单没错')
    next();//需要进行数据库的注册操作
    
  }
}

//做路由登陆验证
function isLogedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('error_msg','您尚未登陆！');
    res.redirect("/login");
  }
  
}

module.exports = router;
