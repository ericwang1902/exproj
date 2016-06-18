var express = require('express');
var router = express.Router();
var wechatjs = require('../controllers/wechatapi');//调用wechatjs来设置

router.get('/order1',function (req,res,next) {
    res.render('./customer/order1',{layout: false});
})

router.post('/createorder',function (req,res,next) {
    console.log(req.body);
})

router.get('/location',function (req,res,next) {
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


module.exports = router;