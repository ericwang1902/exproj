
var express = require('express');
var router = express.Router();
var enumerableconstants = require('../models/enumerableConstants')

var moment = require('moment')

router.post('/bookorder',function (req,res,next) {
    console.log('bookorder:'+JSON.stringify(req.body));
    //解析trace，寻找到运单，存储近order的trace
    
    
    var result={
    "EBusinessID": enumerableconstants.kdniao.businessid,
    "UpdateTime": moment(),
    "Success": true,
    "Reason":""
    }
    
    res.send(result);

})

module.exports = router;