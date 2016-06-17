var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var customer = require('./routes/customer');

var exphbs = require('express-handlebars');

var expressValidator = require('express-validator');//validator1.表单验证

var session = require('express-session');//express-session 1. express-session

var flash = require('connect-flash');//connect-flash 1. connect-flash

//
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var sysuserModel = require('./models/sysuserModel');
var bcrypt = require('bcryptjs');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/my_database');

var app = express();

var seed = require('./models/seed.js');

var wechat = require('wechat');
var config = {
  token: 'exproj',
  appid: 'wx45eb07597f1e004a',
  encodingAESKey: '12RQxjmBlNmQ8HwKRb654CaUPWzx3TjyfFSEZXOhEJD'
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));//设置视图文件夹
app.engine('handlebars',exphbs({defaultLayout:'main'}));//设置默认的模板页
app.set('view engine', 'handlebars');//设置视图引擎



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
//express-session 2. 设置express-session的相关属性
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

//passportjs
app.use(passport.initialize());
app.use(passport.session());

//validator2.Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  },
   customValidators: {
    isPsd1EqPsd2: function(value,psd2) {
        //console.log(value+","+psd2);
        return value===psd2;
    }
 }
}));
//connect-flash 2
app.use(flash());
app.use(function(req,res,next){
  res.locals.sucess_msg=req.flash('sucess_msg');//获取flash的信息，在handlebars中显示出来。
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  sysuserModel.findOne({_id:id}, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    
    sysuserModel.findOne({mobile:username},function(err,user){
      if(err) return console.error(err);
      
      if(!user){
        console.log('用户名不存在');
        
        return done(null,false,{ message: '用户名不存在！' })
      }else{
        bcrypt.compare(password,user.psd,function(err,isMatch){
           if(err) return console.error(err);
           
           if(isMatch){
             console.log("用户名和密码验证成功！")
             return done(null,user);
           }else{
             console.log("密码不匹配！")
             return done(null,false,{message:'密码不匹配！'});
           }
        })
      }
    })
  }
));


//路由
app.use('/', routes);
app.use('/users', users);
app.use('/customer',customer);
app.use(express.query());
app.use('/wechat', wechat(config, function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
  if (message.FromUserName === 'diaosi') {
    // 回复屌丝(普通回复)
    res.reply('hehe');
  } else if (message.FromUserName === 'text') {
    //你也可以这样回复text类型的信息
    res.reply({
      content: 'text object',
      type: 'text'
    });
  } else if (message.FromUserName === 'hehe') {
    // 回复一段音乐
    res.reply({
      type: "music",
      content: {
        title: "来段音乐吧",
        description: "一无所有",
        musicUrl: "http://mp3.com/xx.mp3",
        hqMusicUrl: "http://mp3.com/xx.mp3",
        thumbMediaId: "thisThumbMediaId"
      }
    });
  } else {
    // 回复高富帅(图文回复)
    res.reply([
      {
        title: '你来我家接我吧',
        description: '这是女神与高富帅之间的对话',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://nodeapi.cloudfoundry.com/'
      }
    ]);
  }
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
