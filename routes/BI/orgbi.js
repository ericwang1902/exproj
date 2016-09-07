var express = require('express');
var router = express.Router();
var sysuserController = require('../../controllers/sysuserController')
var sysorderController = require('../../controllers/sysorderController');
var orderoptions = require('../../controllers/orderoptions');
var enumerableConstants = require('../../models/enumerableConstants');
var sysuserModel = require('../../models/sysuserModel');
var sysorderModel = require('../../models/sysorderModel');
var fanModel = require('../../models/fanModel');
var async = require('async');
var moment = require('moment');
var request = require('request');
var mongoose = require('mongoose');
var wechatjs = require('../../controllers/wechatapi');//调用wechatjs来设置



router.get('/orderlistdatagrid',isLogedIn,function(req,res,next){
    var id = req.session.CLuserid

     res.render('./easyui/org/orderlist',{orgid:id})
})

//封装用户treegrid数据接口
router.get('/getorgorderdata',function(req,res,next){
    var orgid = req.query.orgid;
    var page = req.query.page;
    var pageItems = parseInt( req.query.rows);
    console.log(page+' '+pageItems)
    sysorderController.bilist(page,pageItems,{'orgid':orgid},function(err,count,orders){
        if(err) console.log(err);

        for (var index = 0; index < orders.length; index++) {
        orders[index].template=orders[index].template.replace(/simsun/g, 'Microsoft YaHei')//将样式里的宋体改成雅黑，雅黑可以在打印机打印加粗
        orders[index].template=orders[index].template.replace(/height="40"/g, 'height="76.3"')//将条码拉长
        orders[index].template=orders[index].template.replace(/solid #000 1px/g, 'none')//将边框去掉
        //下面两个是将寄件人调小
        orders[index].template=orders[index].template.replace(/.no_border{ width:100%; height:100%; font-size:14px;}/g, '.no_border{ width:100%; height:100%; font-size:14px;}.send_css{margin-top:10px;font-size:12px}')
        orders[index].template=orders[index].template.replace(/<table class="no_border">/g, '<table class="send_css">')
        orders[index].template=orders[index].template.replace(/style="border-top:5px solid #000;"/g, '')//去掉黑线
        
        }

        var result= {
            total:count,
            rows:orders
        }

        res.json(result);
    })
   
})

//网页接单工具
router.post('/pickupdateorder',function(req,res,next){
    console.log(req.body.orderid);
    var  orderid = req.body.orderid;
    var orgid   = req.session.CLuserid;
    //根据orderid和orgid来接单

    async.waterfall([
        function (callback) {
            //查找order的全部信息做下单准备用
            sysorderModel
                .findOne({ _id: orderid })
                .populate('sendid')
                .populate('receiveid')
                .exec(function (err, order) {
                    if (err) console.log(err);
                    var fanopenid = order.sendid.openid;

                    callback(null, order,fanopenid)
                })
        },
        function (order,fanopenid, callback) {
            //查找courier对应的快递点的快递公司、电子面单号、电子面单密码
            //  var courierobjid = new mongoose.Types.ObjectId(courierid);
            sysuserModel.findOne({ _id: orgid }, function (err, courier) {
                if (err) console.log(err);

                sysuserModel.findOne({ _id: courier.orgid }, function (err, org) {
                    if (err) console.log(err);
                    console.log('log~~~~~:'+org._id)

                    callback(null, order, org, courier,fanopenid);
                })
            })
        },
        function (order, org, courier,fanopenid, callback) {
            //快递鸟下单，下单成功后，进行本地订单数据更新，圆通快递下单接口
            var orderoptions1 = {};
            orderoptions1 = orderoptions.ytoOrderOptions(order, org);

            request(orderoptions1, function (err, response, body) {
                console.log('~~~~~~~~~~~~~~' + JSON.stringify(body));
                //先判断状态码是否正确
                if (body.ResultCode == '100') {
                    //需要在返回的数据中获取物流运单号和打印模板,100表示成功
                    var orderResult = body;

                    callback(null, orderResult, courier, org,fanopenid);
                }
                else {
                    //错误处理,单号不足
                    callback(new Error(body.Reason, null));
                }
                

            })

        },
        //处理返回的订单信息，orderResult是个json对象
        function (orderResult, courier, org,fanopenid, callback) {
            //更新订单状态
            sysorderModel.findOne({ _id: orderid }, function (err, order) {
                if (err) console.log(err);

                if (order.status == '0') {
                    console.log('订单状态为0~~~~~~~~~~~~~~~')
                    order.logisticorder = orderResult.Order.LogisticCode;
                    order.status = 1;
                    order.template = orderResult.PrintTemplate;
                    order.courierid = courier._id;//获取取件员的id
                    order.pickdate = moment();
                }
                order.save(function (err, result) {
                    if (err) console.log(err);
                    console.log('订单信息：' + JSON.stringify(result))

                    callback(null, result, org,fanopenid);
                })
            })
        },
        //订阅运单信息
        function (order, org,fanopenid, callback) {
            //订阅接口 参数
            var bookoptions = orderoptions.bookorderoptions(org, order.logisticorder);
            request(bookoptions, function (err, response, body) {
                console.log('订阅接口：' + JSON.stringify(body));

                callback(null, order, org,fanopenid);
            })
        },
           function (order, org,fanopenid, callback) {
            moment.locale('zh-cn');
            var orderdatecn = moment(order.pickdate).format("LLL");
            //发送模板消息
            wechatjs.sendTemplate2(fanopenid,
                'http://exproj.robustudio.com/customer/order?orderid=' + order._id + '&openid=' + fanopenid + '&courierid=' + org._id,
                order.logisticorder,
                 enumerableConstants.orderstatus[order.status].name,,
                orderdatecn,
                org.username,
                org.mobile,
                function (err, result) { })

            callback(null, order, org);
        },
        function (order, org, callback) {
            //扣减在线快递系统的count余额
            sysuserController.modifyCount(org, -1, function (err, org) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, org);
                }

            })
        }
    ], function (err, result) {
        if (err) {
                 res.json({status:11,reason:err.message});//电子面单系统出错

        } else {
           res.json({status:200})//成功
        }
    })

   


})

//做路由登陆验证
function isLogedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('error_msg','您尚未登陆！');
    res.redirect("/login");
  }
  
}
module.exports = router;