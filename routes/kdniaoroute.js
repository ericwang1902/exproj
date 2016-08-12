
var express = require('express');
var router = express.Router();


router.post('/bookorder',function (req,res,next) {
    console.log('bookorder:'+req.body);
    //解析trace，寻找到运单，存储近order的trace
    

    res.send('test')

})

module.exports = router;