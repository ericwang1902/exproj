
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
var kdniao = require('../controllers/kdniao')

router.post('/bookorder',function (req,res,next) {
            
            console.log("body:"+req.body.key1);
          //  console.log("stringify:"+JSON.stringify(req.body));

            res.send("test")
})

module.exports = router;