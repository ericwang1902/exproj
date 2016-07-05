
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
    },
    
    //模板消息发送给快递员
    sendTemplate1:function (openid,url,content,sendname,sendtele,callback) {
        var templateId=enumberableconstants.wechatinfo.templateId;
        // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
        //var url='http://www.baidu.com';
        var data = {
            "first": {
                "value":"客户下单啦！",
                "color":"#173177"
            },
            "keyword1":{
                "value":content,
                "color":"#173177"
            },
            "keyword2": {
                "value":sendname,
                "color":"#173177"
            },
            "keyword3": {
                "value":sendtele,
                "color":"#173177"
            },
            "remark":{
                "value":"请点击进入处理！",
                "color":"#173177"
            }
        };
        api.sendTemplate(openid, templateId, url, data, callback);     
    },
    //模板消息发送给寄件人
    sendTemplate2:function (openid,url,ordernum,orderstatus,orderdate,couriername,couriertele,callback) {
        var templateId=enumberableconstants.wechatinfo.templateId2;
        // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
        //var url='http://www.baidu.com';
        var data = {
            "first": {
                "value":"已经确认接单！",
                "color":"#173177"
            },
            "keyword1":{
                "value":content,
                "color":"#173177"
            },
            "keyword2": {
                "value":orderstatus,
                "color":"#173177"
            },
            "keyword3": {
                "value":orderdate,
                "color":"#173177"
            },
            "remark":{
                "value":"为您服务的是:"+couriername+" "+couriertele,
                "color":"#173177"
            }
        };
        api.sendTemplate(openid, templateId, url, data, callback);     
    },
    
}

