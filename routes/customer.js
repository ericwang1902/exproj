var express = require('express');
var router = express.Router();
var wechatjs = require('../controllers/wechatapi');//调用wechatjs来设置
var https =require('https');
var enumerableconstants = require('../models/enumerableConstants')

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
    console.log(req.query.code);

    var options={
       hostname: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+enumerableconstants.wechatinfo.appid+'&secret='+enumerableconstants.wechatinfo.appsecret+'&code='+req.query.code+'&grant_type=authorization_code'
    }
    https.get(options.hostname,function(res1) {
        console.log('url:'+options.hostname);
        console.log("响应：" + JSON.stringify(res1.body));
    }).on('error', function(e) {
        console.log("错误：" + e.message);
    });
    

    return next();
}


module.exports = router;