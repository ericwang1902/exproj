
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
    
    var LogisticDataArray= req.body.Data;
    //循环orderArray,每一个item是一个订单
    LogisticDataArray.forEach(function (item) {   
        
        var logisticorder = item.LogisticCode;//订单的运单号，用来匹配订单
        async.waterfall([      
            //构造trace，形成trace数组
            function (callback) {
                var TraceArray=[];
                
                item.Traces.forEach(function (trace) { 
                    //构造trace
                    var TraceData = {
                        AcceptTime = trace.AcceptTime,
                        AcceptStation = trace.AcceptStation,
                        Remark = trace.Remark                        
                    }
                    //形成数组
                    TraceArray.push(TraceData);             
                })
                callback(null,TraceArray);
            },
            //构造LogisticData,存储,然后传递其id用来关联order
            function (TraceArray,callback) {
              var LogisticData = new LogisticDataModel({
                EBusinessID : enumerableConstants.kdniao.businessid,
                OrderCode : item.OrderCode,
                ShipperCode : item.ShipperCode,
                LogisticCode : item.LogisticCode,
                Success : item.Success,
                Reason : item.Reason,
                State : item.State,
                CallBack : item.CallBack,
                Traces:TraceArray
                })
               LogisticData.save(function (err,LogisticData) {
                   if(err) console.log(err);
                   
                   var LogisticDataId = LogisticData._id;
                   callback(null,LogisticDataId);
               })
            },
            //查找到该order，关联到logisticdata字段
            function(logisticId,callback){
                sysorderModel
                .findOne({logisticorder:logisticorder})
                .exec(function(err,sysorder){
                    if(err) console.log(err);
                    
                    sysorder.logisticdata =logisticId;
                    
                    sysorder.save(function(err,order){
                        if(err) console.log(err);
                        
                        callback(null,sysorder);
                    })
                })
            }
            
        ],function (err,resut) {
           console.log(resut) ;
            
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