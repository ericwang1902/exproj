var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var sysuserModel = require('../models/sysuserModel');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sysuserController = require('../controllers/sysuserController')
var enumerableConstants = require('../models/enumerableConstants')
var async = require('async');
/* GET home page. */
router.get('/',isLogedIn,function(req, res, next) {
 
  res.render('index');
});

router.post('/',function(req, res, next) {
  res.render('index');
});

router.get('/login',function(req,res,next){
  res.render('./contents/login');
});

router.get('/logout',function (req,res) {
    req.logout();
    req.flash('sucess_msg','你已经登出');
    res.redirect('/login');
})

  router.post('/login',passport.authenticate('local'),
    function(req, res) {
     console.log(req.body);
     
     //查询用户的类型
     sysuserModel.findOne({mobile:req.body.username},function(err,user){
       //存储当前的登陆用户id
       req.session.CLuserid = user._id;
       if(user.usertype ==enumerableConstants.usertype.sysadmin){
         res.redirect('/admin/admindash'); 
       }else if(user.usertype == enumerableConstants.usertype.org){ 
         //跳转到org的dashboard 
           res.redirect('/org/orgdash')
         //res.redirect('/org/orguserlist?id='+user._id);
       }else{
        res.send('目前只有快递代收点的管理人员才可以登录管理后台。')
       }
     })
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
    if(err) render('error',{error:'注册失败！'})
    console.log(result);
    req.flash('sucess_msg','注册成功，请登录！');
    res.redirect('/login');
  });//创建用户
});


//表单验证中间件
function checkRegForm(req,res,next) {
  console.log(req.body);
  var username = req.body.username;
  var password1 = req.body.password1;
  var password2 = req.body.password2;
 // console.log(password2);
  
  req.checkBody('username','用户名不可为空').notEmpty();
  req.checkBody('password1','密码不可为空').notEmpty();
  req.checkBody('password1','两次密码输入不相同').isPsd1EqPsd2(password2);//自定义验证
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
