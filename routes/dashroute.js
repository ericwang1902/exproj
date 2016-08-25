var express = require('express');
var router = express.Router();
var sysordercontroller = require('../controllers/sysorderController');


router.post('/orgdashweek', function(req, res) {
    //获取一周的订单数据,dashdata/orgdashweek
    sysordercontroller.getweekData();

});


module.exports = router;