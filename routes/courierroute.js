var express = require('express');
var router = express.Router();
var wechatjs = require('../controllers/wechatapi');//调用wechatjs来设置
var request =require('request');
var enumerableconstants = require('../models/enumerableConstants')
var async = require('async');
var sysusercontroller = require('../controllers/sysuserController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('./courier/courierdash');
});


router.get('/userbind',getuserinfo,function (req,res,next) { 
   console.log("req.userinfoJson ************"+JSON.stringify(req.userinfoJson));
    res.render('./courier/courierbind',{layout:false,userinfo:req.userinfoJson});
})

router.post('/userbind',function (req,res,next) {
    //校验快递员的用户名和密码，用来绑定openid，只绑定一个；
    var username = req.body.username;
    var psd = req.body.psd;
    var openid = req.body.openid;

    sysusercontroller.courierbind(username,psd,openid,function (err,result) {
      if(err) console.log(err);

      res.redirect('/courier/resultinfo?result='+result);
    })

    
})

router.get('/resultinfo',function (req,res,next) {
    var result = req.query.result;
    var openid = req.query.openid;

    res.render('./contents/resultinfo',{
        layout:false,
        result:result,
        openid:openid,
        helpers:{
            getresultinfo:function(resultnum){
                var info = '';
                switch(resultnum){
                    case '0':
                        info='出错了';
                        break;
                    case '1':
                        info = '用户名错误';
                        break;
                    case '2':
                        info ='绑定失败';
                        break;
                    case '3':
                        info ='绑定成功';
                        break;
                    case '4':
                        info='密码错误';
                        break;
                    case '5':
                        info='地址添加成功!';
                        break;
                    case '6':
                        info='地址修改成功!';
                        break;
                    case '7':
                        info='默认寄件地址设置成功!';
                        break;
                     case '8':
                        info='设置默认快递点成功!';
                        break;                                             
                    default:
                        break;
                }
                return info;
            },
            getmsglogo:function (result) {
                 var cs = '';
                switch(result){
                    case '0':
                        cs='weui_icon_warn';
                        break;
                    case '1':
                        cs = 'weui_icon_warn';
                        break;
                    case '2':
                        cs ='weui_icon_warn';
                        break;
                    case '3':
                        cs ='weui_icon_success';
                        break;
                    case '4':
                        cs='weui_icon_warn';
                        break;
                    case '5':
                        cs='weui_icon_success';
                        break;
                    case '6':
                        cs='weui_icon_success';
                        break;
                    case '7':
                        cs='weui_icon_success';
                        break;  
                    case '8':
                        info='weui_icon_success';
                        break;                     
                    default:
                        break;
                }
                return cs;
            }
        }
    })
})

//通过用户授权，获取微信jstoken和用户信息
function getuserinfo(req,res,next){
    console.log('code:'+req.query.code);//获取微信重定向之后，生成的code 
    async.waterfall([
    //获取accesstoken
    function(callback) {
        var accesstokenoptions={
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+enumerableconstants.wechatinfo.appid+'&secret='+enumerableconstants.wechatinfo.appsecret+'&code='+req.query.code+'&grant_type=authorization_code'
        }
        request(accesstokenoptions,function (error,response,body) { 
            var bodyJson = JSON.parse(body);//转成json对象 
            var access_token = bodyJson.access_token;
            var refresh_token = bodyJson.refresh_token;
            var openid=bodyJson.openid;
            console.log('access_token:'+access_token);
            console.log('refresh_token:'+refresh_token);
            console.log('openid:'+openid);
          callback(null, access_token,refresh_token,openid);
        })    
    },
    //获取用户信息
    function(access_token, refresh_token,openid, callback) {
            console.log('access_token:'+access_token);
            console.log('refresh_token:'+refresh_token);
            console.log('openid:'+openid);
            wechatjs.sendtext(openid,'hello');//客服消息，互动48小时内有效
            var userinfooptions = {
                url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN'
            }
            //这个body就是用户信息
            request(userinfooptions,function (error,response,body) {
             
            callback(null, body);
            })      
    }
], function (err, result) {
    // result now equals 'done'
    console.log(result);
    var userinfoJson = JSON.parse(result);
    req.userinfoJson = userinfoJson;
    
    
    return next();
});
    
}


module.exports = router;
