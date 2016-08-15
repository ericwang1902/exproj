
var express = require('express');
var router = express.Router();
var enumerableconstants = require('../models/enumerableConstants');
var moment = require('moment');
var sysorderModel = require('../models/sysorderModel');
var LogisticDataModel = require('../models/LogisticDataModel');
var TraceModel = require('../models/TraceModel');
var async = require('async');
var mongoose = require('mongoose');
var enumerableConstants = require('../models/enumerableConstants');

router.post('/bookorder',function (req,res,next) {
   // console.log('bookorder:'+JSON.stringify(req.body));
    //解析body，获取其中的运单编号，查找改运单编号，来更新该运单的数据
   //推送的消息中，解析Data数据，Data中是order的trace
    var LogisticDataArray= req.body.Data;
    //循环orderArray,每一个item是一个订单
    LogisticDataArray.forEach(function (item) {
      //LogisticData使用来存储每一个订单的物流数据  
      var LogisticData = new LogisticDataModel(
            {
                EBusinessID : enumerableConstants.kdniao.businessid,
			    OrderCode : item.OrderCode,
			    ShipperCode : item.ShipperCode,
			    LogisticCode : item.LogisticCode,
			    Success : item.Success,
			    Reason : item.Reason,
			    State : item.State,
			    CallBack : item.CallBack
            })
      
        
        //根据item的logisticorder查找系统内的订单信息
        var logisticorder = item.LogisticCode;
        
        async.waterfall([
            //查找订单信息
            function (callback) {
                sysorderModel
                .findOne({logisticorder:logisticorder})
                .exec(function (err,orderinfo) {
                    if(err) console.log(err);
                    
                    callback(null,orderinfo);
                })            
            },
            //获取到orderinfo之后，循环trace，每一个trace都放进trace数组
            function (orderinfo,callback) {
                 item.Traces.forEach(function (trace) { 
                 //trace数据 
                 var TraceData = new TraceModel({
                    AcceptTime = trace.AcceptTime,
                    AcceptStation = trace.AcceptStation,
                    Remark = trace.Remark,
                    orderId = orderinfo._id
                }) 
                LogisticData.Traces.push(TraceData);//讲数组内容放到Traces中                 
                })
                LogisticData.save(function(err,logisticdata){
                    console.log("logisticdata存储结果："+logisticdata);
                })
            
            }
            
            
        ],function (err,resut) {
            
        })
        
  
      
        

        
        
        
    })
    
    
    
    var result={
    "EBusinessID": enumerableconstants.kdniao.businessid,
    "UpdateTime": moment(),
    "Success": true,
    "Reason":""
    }
    
    res.send(result);

})

module.exports = router;