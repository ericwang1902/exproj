var WechatAPI = require('wechat-api');
var enumberableconstants =require('../models/enumerableConstants');
var api = new WechatAPI(enumberableconstants.wechatinfo.appid, enumberableconstants.wechatinfo.appsecret);//需要修改

//api.setOpts({timeout: 15000});
api.getLatestToken(function (err,token) {
    console.log('token:'+JSON.stringify(token));
    console.log('accesstoken:'+token.accessToken);
});

api.getTicket(function (err,result) {
console.log('ticket:'+JSON.stringify(result));
})

var param = {
 debug: false,
 jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
 url: 'http://exproj.robustudio.com'
};
//这是用来获取configdata，给前端jssdk网页调用的。
api.getJsConfig(param,function (err,result) {
    console.log('config:'+JSON.stringify(result));
})