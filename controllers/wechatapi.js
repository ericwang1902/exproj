
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
    //客服消息
    sendtext:function (openid,text) {
        api.sendText(openid, text, function (err,result) {
            console.log('sendtext:'+result);
        });
    },
    //生成永久二维码
    createLimitQRCode:function (senceid,callback) {
        api.createLimitQRCode(senceid,function (err,ticket) {
            if(err) console.log(err);
            
            callback(null,ticket);//ticket是换取二维码的票据
        })
    },
    //获取二维码的img地址
    showQRCodeURL:function (ticket,callback) {
        api.showQRCodeURL(ticket,function (err,imgurl) {
            if(err)console.log(err);
            
            callback(null,imgurl);//imgurl是二维码的图片链接地址
        })
    }
    
    //模板消息
}

