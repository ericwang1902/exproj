var express = require('express');
var router = express.Router();
var sysuserController = require('../../controllers/sysuserController')
var sysorderController = require('../../controllers/sysorderController');
var enumerableConstants = require('../../models/enumerableConstants')
var sysuserModel = require('../../models/sysuserModel');
var sysorderModel = require('../../models/sysorderModel');
var async = require('async');
var moment = require('moment');

router.get('/orderlistdatagrid',function(req,res,next){
     res.render('./easyui/org/orderlist')
})

//封装用户treegrid数据接口
router.get('/getorgorderdata',function(req,res,next){
    var page = req.query.page;
    var pageItems = parseInt( req.query.rows);
    console.log(page+' '+pageItems)
    sysorderController.bilist(page,pageItems,{},function(err,count,orders){
        if(err) console.log(err);
        var result= {
            total:count,
            rows:orders
        }

        res.json(result);
    })
   
})

module.exports = router;