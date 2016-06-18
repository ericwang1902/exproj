
var WechatAPI = require('wechat-api');
var enumberableconstants =require('../models/enumerableConstants');
var api = new WechatAPI(enumberableconstants.wechatinfo.appid, enumberableconstants.wechatinfo.appsecret);//需要修改


//api.setOpts({timeout: 15000});

module.exports={
    //获取最新jssdk token
    gettoken:function (callback) {
        api.getLatestToken(function (err,token) {
        console.log('token:'+JSON.stringify(token));
        console.log('accesstoken:'+token.accessToken);
        if(err) console.log(err);

        callback(null,token);
        });
    },
    //获取最新ticket
    getticket:function (callback) {
        api.getTicket(function (err,result) {
            console.log('ticket:'+JSON.stringify(result));
            if(err) console.log(err);

            callback(null,result);
        })
    },
    //获取最新的jssdk config
    getjsconfig:function (callback) {
        var param = {
            debug: false,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
            url: 'http://exproj.robustudio.com'
            };
        //这是用来获取configdata，给前端jssdk网页调用的。
        api.getJsConfig(param,function (err,result) {
            
            if(err) console.log(err);

            callback(null,result);//返回config
        }) 
    }
}