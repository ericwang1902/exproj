
var express = require('express');
var router = express.Router();
var enumerableconstants = require('../models/enumerableConstants');
var moment = require('moment');
var sysorderModel = require('../models/sysorderModel');
var async = require('async');
var mongoose = require('mongoose');

router.post('/bookorder',function (req,res,next) {
    console.log('bookorder:'+JSON.stringify(req.body));
    //解析body，获取其中的运单编号，查找改运单编号，来更新该运单的数据
    
    var TraceArray= req.body.Data;
    //循环orderArray
    TraceArray.forEach(function (trace) {
        var logisticorder = trace.LogisticCode;
        //查找运单，更新订单的trace字段
        sysorderModel.findOne({logisticorder:logisticorder},function (err,orderinfo) {
            if(err) console.log(err);
            
            console.log(orderinfo);
           // orderinfo.trace=trace;
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