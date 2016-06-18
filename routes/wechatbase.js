var express =require('express');
var router =express.Router();
var wechatjs = require('../controllers/wechatapi');//调用wechatjs来设置
var request =require('request');


//jssdk的wx.config要获取的配置数据
router.post('/getconfig',function (req,res,next) {
    var url =req.body.url;
    console.log(url);
    //获取url，结合其他参数，计算签名等，并返回给前端
    wechatjs.getjsconfig(url,function (err,config) {
        if(err) console.log(err);
        
        res.send(config);
    })
})


module.exports = router;