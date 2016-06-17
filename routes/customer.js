var express = require('express');
var router = express.Router();

router.get('/order1',function (req,res,next) {
    res.render('./customer/order1',{layout: false});
})

router.post('/createorder',function (req,res,next) {
    console.log(req.body);
})

router.get('/location',function (req,res,next) {
    res.render('./customer/location',{layout:false});
})

router.post('/location',function(req,res,next){
    console.log(req.body);
})


module.exports = router;