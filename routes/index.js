var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login',function(req,res,next){
  res.render('./contents/login');
});

router.post('/login',function (req,res,next) {
    console.log(req.body);
    
    var username = req.body.username;
    var password = req.body.password;
    
    req.checkBody('username','用户名不可为空').notEmpty();
    req.checkBody('password','密码不可为空').notEmpty();
    
    var errors = req.validationErrors();
    
    if(errors){
      console.log("表单有错")
      res.render('./contents/login',{errors:errors});
    }else{
      console.log('表单没错')
      //进行数据库的登录操作
    }
    
})

router.get('/register',function(req,res,next){
  res.render('./contents/register');
});

router.post('/register',function(req,res,next){
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password1;
  var password2 = req.body.password2;
  
  req.checkBody('username','用户名不可为空').notEmpty();
  req.checkBody('password','密码不可为空').notEmpty();
  req.checkBody('password2','请重复输入密码').notEmpty();
  
  var errors = req.validationErrors();
  
  if(errors){
    console.log('注册表单有错')
    res.render('./contents/register',{errors:errors});
  }else{
    console.log('表单没错')
    //需要进行数据库的注册操作
  }
  
  //res.render('./contents/register');
});

module.exports = router;
