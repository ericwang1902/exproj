var express = require('express');
var router = express.Router();
var wechatjs = require('../controllers/wechatapi');//调用wechatjs来设置
var request =require('request');
var enumerableconstants = require('../models/enumerableConstants')
var async = require('async');

router.get('/order1',function (req,res,next) {
    res.render('./customer/order1',{layout: false});
})

router.post('/createorder',function (req,res,next) {
    console.log(req.body);
})

router.get('/location',getjssdktoken,function (req,res,next) {
        //获取相关信息
   
       console.log('URL:'+JSON.parse(req));
    wechatjs.getjsconfig(req.orginalurl,function (err,result) {
        if(err) console.log(err);
        
        console.log('config:'+JSON.stringify(result));
        //config:{"debug":false,
        //"appId":"wx45eb07597f1e004a",
        //"timestamp":"1466210272",
        //"nonceStr":"cv6fntr2777rpb9",
        //"signature":"2e75be9440ee086a597313842d8312eb54b8c417",
        //"jsApiList":["onMenuShareTimeline","onMenuShareAppMessage"]}
        res.render('./customer/location',{layout:false,config:result});

    })

    
})

router.post('/location',function(req,res,next){
    console.log(req.body);


})

//获取微信jstoken和用户信息
function getjssdktoken(req,res,next){
    console.log(req.query.code);//获取微信重定向之后，生成的code 
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
            
            var userinfooptions = {
                url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN'
            }
            request(userinfooptions,function (error,response,body) {
             
            callback(null, body);
            })      
    }
], function (err, result) {
    // result now equals 'done'
    console.log(result);
    var userinfoJson = JSON.parse(result);
    
    
});
    
    return next();
}


module.exports = router;