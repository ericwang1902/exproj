var express = require('express');
var router = express.Router();
var sysuserController = require('../controllers/sysuserController');
var enumerableConstants = require('../models/enumerableConstants');

/* GET users listing. */
router.get('/orgdash', function(req, res, next) {
  res.render('./org/orgdash');
});

router.get('/orguserlist',function (req,res,next) {
    var id = req.query.id;
    var p = req.query.p;//当前页号
    //查找该org下的所有的快递员
    
    sysuserController.orglist(p,{orgid:id},function(err,count,users1){
        var TotalPage = Math.ceil(count/10);

        var pagesArray =[];

        for(var i=1;i<=TotalPage;i++){
            pagesArray.push({p:i});
        }
   
        res.render('./org/orguserlist',{
                users:users1,
                pagesArray:pagesArray
            });
    })
       
})

router.get('/orguserdetail',function (req,res,next) {
    var id = req.query.id;

    sysuserController.orguserdetail(id,function (err,user) {
        if(err) console.log(err);

      //  res.send(user);
      res.render('./org/orgdetail',{
          user:user,
          helpers:{
              getUsertype: function(usertype){
                          var typename='';
                    switch(usertype){
                        case '1':typename='系统管理员';break;
                        case '2':typename='快递点';break;
                        case '3':typename='快递员';break;
                        default:break;
                    }
                    return typename;
              },
            getCompany:function(user){
                if(user.usertype!='1' && user.type!='' && user.type!=null){
                    return enumerableConstants.expCompany[user.type-1].name;
                }
                else
                    return '';
            }
          }
        });
    })

})

module.exports = router;
