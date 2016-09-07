var express = require('express');
var router = express.Router();
var sysuserController = require('../../controllers/sysuserController')
var sysorderController = require('../../controllers/sysorderController');
var enumerableConstants = require('../../models/enumerableConstants')
var sysuserModel = require('../../models/sysuserModel');
var sysorderModel = require('../../models/sysorderModel');
var async = require('async');
var moment = require('moment');

router.get('/orderlistdatagrid',isLogedIn,function(req,res,next){
    var id = req.session.CLuserid

     res.render('./easyui/org/orderlist',{orgid:id})
})

//封装用户treegrid数据接口
router.get('/getorgorderdata',function(req,res,next){
    var orgid = req.query.orgid;
    var page = req.query.page;
    var pageItems = parseInt( req.query.rows);
    console.log(page+' '+pageItems)
    sysorderController.bilist(page,pageItems,{'orgid':orgid},function(err,count,orders){
        if(err) console.log(err);

        for (var index = 0; index < orders.length; index++) {
        orders[index].template=orders[index].template.replace(/simsun/g, 'Microsoft YaHei')//将样式里的宋体改成雅黑，雅黑可以在打印机打印加粗
        orders[index].template=orders[index].template.replace(/height="40"/g, 'height="76.3"')//将条码拉长
        orders[index].template=orders[index].template.replace(/solid #000 1px/g, 'none')//将边框去掉
        //下面两个是将寄件人调小
        orders[index].template=orders[index].template.replace(/.no_border{ width:100%; height:100%; font-size:14px;}/g, '.no_border{ width:100%; height:100%; font-size:14px;}.send_css{margin-top:10px;font-size:12px}')
        orders[index].template=orders[index].template.replace(/<table class="no_border">/g, '<table class="send_css">')
        orders[index].template=orders[index].template.replace(/style="border-top:5px solid #000;"/g, '')//去掉黑线
        
        }

        var result= {
            total:count,
            rows:orders
        }

        res.json(result);
    })
   
})

//网页接单工具
router.post('/pickupdateorder',function(req,res,next){
    console.log(req.body.orderid);
    res.json({status:200})


})

//做路由登陆验证
function isLogedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('error_msg','您尚未登陆！');
    res.redirect("/login");
  }
  
}
module.exports = router;