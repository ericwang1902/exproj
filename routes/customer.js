var express = require('express');
var router = express.Router();
var wechatjs = require('../controllers/wechatapi');//调用wechatjs来设置
var request =require('request');
var enumerableconstants = require('../models/enumerableConstants')
var async = require('async');
var locationController = require('../controllers/locationController');
var fanModel =require('../models/fanModel');

router.get('/order1',function (req,res,next) {
    res.render('./customer/order1',{layout: false});
})

router.post('/createorder',function (req,res,next) {
    console.log(req.body);
})

router.get('/location',getuserinfo,function (req,res,next) {
    //进入到这个页面的时候，通过授权来获取用户信息
    var userinfo =req.userinfo;

    // async.waterfall([
    //     //获取地址所对应的粉丝
    //     function(callback) {
    //         fanModel.findOne({openid:userinfo.openid},function (err,fan) {
    //             if(err) console.log(err);

    //             if(!fan){
    //                 //创建粉丝数据
    //                 var fan = new fanModel({
    //                     openid:userinfo.openid
    //                 })

    //                 fan.save(function (err,fan) {
    //                     if(err) console.log(err);
                        
    //                     callback(null, fan);
    //                 })

    //             }else{
    //                 //已经有粉丝了
    //                  callback(null, fan);
    //             }     
    //         })
            
    //     },
    //     //添加地址数据
    //     function(arg1, arg2, callback) {
    //     // arg1 now equals 'one' and arg2 now equals 'two'
    //         callback(null, 'three');
    //     },
    //     function(arg1, callback) {
    //         // arg1 now equals 'three'
    //         callback(null, 'done');
    //     }
    // ], function (err, result) {
    //     // result now equals 'done'
    // });



    res.render('./customer/location',{layout:false,userinfo:req.userinfoJson});
})

router.post('/location',function(req,res,next){
    console.log(req.body);
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