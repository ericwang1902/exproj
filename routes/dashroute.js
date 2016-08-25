var express = require('express');
var router = express.Router();
var sysordercontroller = require('../controllers/sysorderController');
var mongoose = require('mongoose');

router.post('/orgdashweek', function(req, res) {
    //获取一周的订单数据,dashdata/orgdashweek
    console.log(JSON.stringify(req.body));

    var orgid = new mongoose.Types.ObjectId('57663f682161fb550677ce11');

    sysordercontroller.getweekData(orgid,function(err,result){
         console.log(JSON.stringify(result));
         res.send(JSON.stringify(result))
    });

});


module.exports = router;