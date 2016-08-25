var express = require('express');
var router = express.Router();
var sysordercontroller = require('../controllers/sysorderController');


router.post('/orgdashweek', function(req, res) {
    //获取一周的订单数据,dashdata/orgdashweek
    sysordercontroller.getweekData('57663f682161fb550677ce11',function(err,result){
         console.log(JSON.stringify(result));
    });

});


module.exports = router;