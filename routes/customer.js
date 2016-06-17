var express = require('express');
var router = express.Router();
var WechatAPI = require('wechat-api');
var enumberableconstants =require('../models/enumerableConstants');
var api = new WechatAPI(enumberableconstants.wechatinfo.appid, enumberableconstants.wechatinfo.appsecret);//需要修改

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
})

module.exports = router;