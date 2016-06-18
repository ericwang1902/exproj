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
       
    wechatjs.getjsconfig(function (err,result) {
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

function getjssdktoken(req,res,next){
    console.log(req.query.code);//获取微信重定向之后，生成的code


    
    async.waterfall([
    //获取accesstoken
    function(callback) {
        var accesstokenoptions={
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+enumerableconstants.wechatinfo.appid+'&secret='+enumerableconstants.wechatinfo.appsecret+'&code='+req.query.code+'&grant_type=authorization_code'
        }
        request(accesstokenoptions,function (error,response,body) {  
            var access_token = body.access_token;
            var refresh_token = body.refresh_token;
            var openid=body.openid;
               
        })
        callback(null, access_token, refresh_token,openid);
    },
    //获取用户信息
    function(access_token, refresh_token,openid, callback) {
        var userinfooptions={
            url: 'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN'
        }
        request(userinfooptions,function (err,response,body) {
            console.log('err:'+err);
            console.log('response:'+response);
            console.log('body:'+body);
        })
        callback(null, 'three');
    },
    function(arg1, callback) {
        // arg1 now equals 'three'
        callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
    
});
    
    

    return next();
}


module.exports = router;