
var express = require('express');
var router = express.Router();


router.post('/bookorder',function (req,res,next) {
    console.log('bookorder:'+req.body);
    //解析trace，寻找到运单，存储近order的trace
    
    var result={
    "EBusinessID": "1256928",
    "UpdateTime": "2015-3-11 16:26:11",
    "Success": true,
    "Reason":""
    }
    res.json(result);

})

module.exports = router;