var WechatAPI = require('wechat-api');
var enumberableconstants =require('../models/enumerableConstants');
var api = new WechatAPI(enumberableconstants.wechatinfo.appid, enumberableconstants.wechatinfo.appsecret);//需要修改

//api.setOpts({timeout: 15000});
api.getLatestToken(function (err,token) {
    console.log('token:'+JSON.stringify(token));
    console.log('accesstoken:'+token.accessToken);
});

