var express = require('express');
var router = express.Router();
var fanController = require('../controllers/fanController.js');
var sysordercontroller = require('../controllers/sysordercontroller');


router.post('/orgdashweek', function(req, res) {
    //获取一周的订单数据,dashdata/orgdashweek
    sysordercontroller.getweekData();

});


module.exports = router;