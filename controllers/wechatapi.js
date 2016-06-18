
var WechatAPI = require('wechat-api');
var enumberableconstants =require('../models/enumerableConstants');
var api = new WechatAPI(enumberableconstants.wechatinfo.appid, enumberableconstants.wechatinfo.appsecret);//需要修改


//api.setOpts({timeout: 15000});

module.exports={

    //获取最新的jssdk config
    getjsconfig:function (url,callback) {
        console.log(url);
        var param = {
            debug: false,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
            url: url
            };
        //这是用来获取configdata，给前端jssdk网页调用的。
        api.getJsConfig(param,function (err,result) {
                  //config:{"debug":false,
        //"appId":"wx45eb07597f1e004a",
        //"timestamp":"1466210272",
        //"nonceStr":"cv6fntr2777rpb9",
        //"signature":"2e75be9440ee086a597313842d8312eb54b8c417",
        //"jsApiList":["onMenuShareTimeline","onMenuShareAppMessage"]}
            if(err) console.log(err);

            callback(null,result);//返回config
        }) 
    },
    sendtext:function (openid,text) {
        api.sendText(openid, text, function (err,result) {
            console.log('sendtext:'+result);
        });
    }
}

