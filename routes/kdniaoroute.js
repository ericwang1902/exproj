
var express = require('express');
var router = express.Router();


router.post('/bookorder',function (req,res,next) {
    console.log('bookorder:'+req.body);
})

module.exports = router;