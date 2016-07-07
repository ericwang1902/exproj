var express = require('express');
var router = express.Router();
var wechatjs = require('../controllers/wechatapi');//调用wechatjs来设置
var request =require('request');
var enumerableconstants = require('../models/enumerableConstants')
var async = require('async');
var sysusercontroller = require('../controllers/sysuserController')
var fanModel =require('../models/fanModel');
var sysorderModel = require('../models/sysorderModel');
var moment = require('moment')
var sysuserModel = require('../models/sysuserModel');
var kdniao = require('../controllers/kdniao');
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('./courier/courierdash');
});


router.get('/userbind',getuserinfo,function (req,res,next) { 
   console.log("req.userinfoJson ************"+JSON.stringify(req.userinfoJson));
    res.render('./courier/courierbind',{layout:false,userinfo:req.userinfoJson});
})

router.post('/userbind',function (req,res,next) {
    //校验快递员的用户名和密码，用来绑定openid，只绑定一个；
    var username = req.body.username;
    var psd = req.body.psd;
    var openid = req.body.openid;

    sysusercontroller.courierbind(username,psd,openid,function (err,result) {
      if(err) console.log(err);

      res.redirect('/courier/resultinfo?result='+result);
    })

    
})

router.get('/resultinfo',function (req,res,next) {
    var result = req.query.result;
    var openid = req.query.openid;

    res.render('./contents/resultinfo',{
        layout:false,
        result:result,
        openid:openid,
        helpers:{
            getresultinfo:function(resultnum){
                var info = '';
                switch(resultnum){
                    case '0':
                        info='出错了';
                        break;
                    case '1':
                        info = '用户名错误';
                        break;
                    case '2':
                        info ='绑定失败';
                        break;
                    case '3':
                        info ='绑定成功';
                        break;
                    case '4':
                        info='密码错误';
                        break;
                    case '5':
                        info='地址添加成功!';
                        break;
                    case '6':
                        info='地址修改成功!';
                        break;
                    case '7':
                        info='默认寄件地址设置成功!';
                        break;
                     case '8':
                        info='设置默认快递点成功!';
                        break; 
                     case '9':
                        info='设置寄件人出错！';
                        break;   
                     case '10':
                        info='下单成功！';
                        break;                                             
                    default:
                        info='出错了！';
                        break;
                }
                return info;
            },
            getresultdes:function (resultnum) {
                var des='';
                switch (resultnum) {
                    case '9':
                        des='尚未维护寄件人，或您未选中寄件人！'
                        break;
                
                    default:
                        break;
                }
                return des;
            },
            getmsglogo:function (result) {
                 var cs = '';
                switch(result){
                    case '0':
                        cs='weui_icon_warn';
                        break;
                    case '1':
                        cs = 'weui_icon_warn';
                        break;
                    case '2':
                        cs ='weui_icon_warn';
                        break;
                    case '3':
                        cs ='weui_icon_success';
                        break;
                    case '4':
                        cs='weui_icon_warn';
                        break;
                    case '5':
                        cs='weui_icon_success';
                        break;
                    case '6':
                        cs='weui_icon_success';
                        break;
                    case '7':
                        cs='weui_icon_success';
                        break;  
                    case '8':
                        cs='weui_icon_success';
                        break;
                    case '9':
                        cs='weui_icon_warn';
                        break;     
                    case '10':
                        cs='weui_icon_success';
                        break;                                 
                    default:
                        cs='weui_icon_warn';                   
                        break;
                }
                return cs;
            }
        }
    })
})

router.get('/orderhandle',function (req,res,next) {
    var openid = req.query.openid;
    var orderid = req.query.orderid;
    var courierid = req.query.courierid;//快递员的openid，用来接单后传递给order的
    console.log('/orderhandle:'+courierid);
    try{
        sysorderModel
        .findOne({_id:orderid})
        .populate('sendid')
        .populate('receiveid')
        .exec(function(err,order){
            if(err) console.log(err);
            
            console.log(order);
            
            
            res.render('./courier/orderhandle',{
                layout:false,
                openid:openid,
                order:order,
                courierid:courierid,
                            helpers:{
                getstatusname:function(num){
                    
                    return enumerableconstants.orderstatus[num].name;
                },
                getorderdate:function(orderdate){
                    moment.locale('zh-cn');
                    return moment(orderdate).format("LLL");
                },
                getlogisticorder:function(ordernum){
                    if(ordernum=='')
                        return '尚未生成单号';
                    else
                        return ordernum;
                },
                ifshowbtn:function(statusnum,options){
                    console.log(statusnum);
                    console.log(statusnum =='0');
                    if(statusnum=='0')
                    {
                        return options.fn(this);
                        }
                    else{
                        return options.inverse(this);
                        }
                }
            }
            })
        })
    }catch(err){
        res.redirect('/courier/resultinfo?result=-1&openid='+openid);
    }
})
//订单状态修改,快递员取件接口
router.post('/pickupdateorder',function(req,res,next){
    var openid = req.query.openid;//客户的openid
    var targetstatus = req.body.targetstatus;
    var orderid = req.body.orderid;
    var courierid = req.body.courierid;//获取取件快递员的openid
    console.log('/pickupdateorder courierid：'+courierid);
    
    async.waterfall([
        function(callback){
            //查找order的全部信息做下单准备用
            sysorderModel
                .findOne({_id:orderid})
                .populate('sendid')
                .populate('receiveid')
                .exec(function(err,order){
                    if(err) console.log(err);
                    
                    callback(null,order)
                })
        },
        function(order,callback){
          //查找courier对应的快递点的快递公司、电子面单号、电子面单密码
        //  var courierobjid = new mongoose.Types.ObjectId(courierid);
          sysuserModel.findOne({openid:courierid},function(err,courier){
              if(err) console.log(err);
              
              sysuserModel.findOne({_id:courier.orgid},function(err,org){
                  if(err) console.log(err);
                  
                  callback(null,order,org);
              })
          })  
        },
        function(order,org,callback){
          //快递鸟下单，下单成功后，进行本地订单数据更新
          var lordernum = '';
          
          //快递鸟下单的order
          var requestdata={
              OrderCode:order.ordercode,
              ShipperCode:enumerableconstants.expCompany[org.type].code,//快递公司代码
             // CustomerName:'',//电子面单账号
             // CustomerPwd:'',//电子面单密码
              PayType:'1',
              LogisticCode:'',
              ExpType:'1',
              Sender:{
                  Company:order.sendid.company,
                  Name:order.sendid.name,
                  Mobile:order.sendid.tele,
                  PostCode:order.sendid.postcode,
                  ProvinceName:order.sendid.provincename,
                  CityName:order.sendid.cityname,
                  ExpAreaName:order.sendid.expareaname,
                  Address:order.sendid.address
              },
              Receiver:{
                  Company:order.receiveid.company,
                  Name:order.receiveid.name,
                  Mobile:order.receiveid.tele,
                  PostCode:order.receiveid.postcode,
                  ProvinceName:order.receiveid.provincename,
                  CityName:order.receiveid.cityname,
                  ExpAreaName:order.receiveid.expareaname,
                  Address:order.receiveid.address
              },
              Commodity:{
                  GoodsName:order.goodsname,
                  GoodsDesc:order.goodsdes
              },
              IsReturnPrintTemplate:'1'
          }
          var ebusinessid =enumerableconstants.kdniao.businessid;
          var requestype = '1007';
          var datasign = kdniao.dataSign(requestdata,enumerableconstants.kdniao.apikey)
          var datatype = 2;//json格式
          var requestdatautf8 = requestdata
          
          var orderoptions={
              url:enumerableconstants.kdniao.apiurl,
              method:'POST',
              json:true,
              body:{
                  RequestData:requestdatautf8,
                  EBusinessID:ebusinessid,
                  RequestType:requestype,
                  DataSign:datasign,
                  DataType:datatype
              }
          }
          console.log('orderoptions.body:'+JSON.stringify(orderoptions.body));
          
          request(orderoptions,function(err,response,body){
              console.log('~~~~~~~~~~~~~~'+JSON.stringify(body));
              //需要在返回的数据中获取物流运单号
              callback(null,lordernum);
          })
          
          
          
        },
        function(lordernum,callback){
            //更新订单状态
            sysorderModel.findOne({_id:orderid},function(err,order){
                if(err) console.log(err);
                
                if(order.status == '0')
                {
                    order.logisticorder=lordernum;
                    order.status =targetstatus;
                }
                order.save(function(err,result){
                    if(err) console.log(err);
                    
                    callback(null,result);
                })
            })
        },
        function(order,callback){
            //查找courier,用来返回快递员信息，放在模板消息里发出去的
            sysuserModel.findOne({openid:courierid},function(err,courier){
                if(err) console.log(err);
                
                callback(null,order,courier);
            })
        },
        function(order,courier,callback){
            moment.locale('zh-cn');
           var orderdatecn= moment(order.orderdate).format("LLL");
            //发送模板消息
            wechatjs.sendTemplate2(openid,
            'http://exproj.robustudio.com/customer/order?orderid='+order._id+'&openid='+openid+'&courierid='+courierid,
            order.ordercode,
            enumerableconstants.orderstatus[order.status].name,
            orderdatecn,
            courier.username,
            courier.mobile,
            function(err,result){})
            
            callback(null,order);
        }
    ],function(err,result){
        res.redirect('/courier/orderhandle?openid='+openid+'&orderid='+orderid+'&courierid='+courierid);
    
    })
    
    
})

//通过用户授权，获取微信jstoken和用户信息
function getuserinfo(req,res,next){
    
    if(req.query.openid){
        var userinfoJson={
            openid:req.query.openid
        }
         req.userinfoJson = userinfoJson;
       return next();
    }
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
          //  wechatjs.sendtext(openid,'hello');//客服消息，互动48小时内有效
            var userinfooptions = {
                url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN'
            }
            fanModel.findOne({openid:openid},function (err,fan) {
                if(err) console.log(err);

                if(!fan){
                    //创建粉丝数据
                    var fan = new fanModel({
                        openid:openid
                    })
                    fan.save(function (err,fan) {
                        if(err) console.log(err);
                        
                        //这个body就是用户信息
                        request(userinfooptions,function (error,response,body) {
                        callback(null, body);
                        })    
                    })
                }else{
                    //已经有粉丝了
                    console.log(fan);
                    //这个body就是用户信息
                    request(userinfooptions,function (error,response,body) {
                    callback(null, body);
                    })    
                }     
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
