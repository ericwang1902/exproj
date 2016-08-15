
var express = require('express');
var router = express.Router();
var enumerableconstants = require('../models/enumerableConstants');
var moment = require('moment');
var sysorderModel = require('../models/sysorderModel');
var LogisticDataModel = require('../models/LogisticDataModel');
var TraceModel = require('../models/traceModel');
var async = require('async');
var mongoose = require('mongoose');
var enumerableConstants = require('../models/enumerableConstants');

router.post('/bookorder',function (req,res,next) {
    
        console.log(req.body);
   
            var LogisticDataArray= req.body.Data;
            //循环orderArray,每一个item是一个订单
            LogisticDataArray.forEach(function (item) {   
        
            var logisticorder = item.LogisticCode;//订单的运单号，用来匹配订单
            console.log('logisticorder:'+logisticorder);
            async.waterfall([      
            //构造trace，形成trace数组
                function (callback) {
                    var TraceArray=[];
                
                    item.Traces.forEach(function (trace) { 
                    //构造trace
                    var TraceData = {
                        AcceptTime : trace.AcceptTime,
                        AcceptStation : trace.AcceptStation,
                        Remark : trace.Remark                        
                    }
                    //形成数组
                    TraceArray.push(TraceData);             
                    })
                    callback(null,TraceArray);
                },
                //构造LogisticData,存储,然后传递其id用来关联order
                function (TraceArray,callback) {
                //先根据LogisticCode查找，如果有就修改，没有新增  
                    LogisticDataModel
                    .findOne({LogisticCode:item.LogisticCode})
                    .exec(function(err,result){
                        if(result){
                            //存在该运单路径纪录，更新即可
                            result.Traces = TraceArray;
                            
                            result.save(function(err,saveresult){
                                if(err) console.log(err);
                                
                                var LogisticDataId = saveresult._id;
                                callback(null,LogisticDataId);
                            })                     
                        }else{
                            //不存在改运单路径纪录，新增
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
                        }
                    })
                },
                    //查找到该order，关联到logisticdata字段
                    function(logisticId,callback){
                        sysorderModel
                        .findOne({logisticorder:logisticorder})
                        .exec(function(err,sysorder){
                            if(err) console.log(err);
                            console.log('order result:'+sysorder);
                            if(sysorder){
                                sysorder.logisticdata =logisticId;
                                sysorder.save(function(err,order){
                                if(err) console.log(err);
                                callback(null,order)
                            })
                            }
                            else{
                               callback(null,'没有这个单子')
                            }
                        })
                    }
            
        ],function (err,result) {
           var info={
                    "EBusinessID": enumerableconstants.kdniao.businessid,
                    "UpdateTime": moment(),
                    "Success": true,
                    "Reason":""
            }
           
            if(LogisticDataArray.indexOf(item)== LogisticDataArray.length-1)
           {
              return res.send(info);
           }          
        })
               
    })

})

module.exports = router;