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
    res.render('./customer/location',{layout:false});
})

router.post('/location',function(req,res,next){
    console.log(req.body);
    //获取相关信息
    wechatjs.getjsconfig(function (err,result) {
        if(err) console.log(err);
        console.log('config:'+JSON.stringify(result));
    })

})


module.exports = router;