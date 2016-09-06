var express = require('express');
var router = express.Router();
var sysuserController = require('../../controllers/sysuserController')
var sysorderController = require('../../controllers/sysorderController');
var enumerableConstants = require('../../models/enumerableConstants')
var sysuserModel = require('../../models/sysuserModel');
var sysorderModel = require('../../models/sysorderModel');
var async = require('async');
var moment = require('moment')




//新版管理员页面的用户列表
router.get('/courierlist',function(req,res,next){

  res.render('./easyui/admin/courierlist',{layout: false})
})

//获取用户数据的url
router.get('/getusers',function(req,res,next){
    async.series([
        function(callback){
          sysuserModel.find({},function(err,users){
          //查找到了系统内所有的users
            if (err) {
              console.log(err)
            }

            var usersmodify=[];
            for (var index = 0; index < users.length; index++) {
               var usertypename = ''
              if (users[index].usertype=='1') {
                usertypename='管理员'
              } else if(users[index].usertype=='2') {
                usertypename='快递点'
              }else if(users[index].usertype=='3') {
                usertypename='快递员'
              }
             
                var user={
                  id:users[index]._id,
                  mobile:users[index].mobile,
                  username:users[index].username,
                  usertype:usertypename,
                  count:users[index].count
                }
                usersmodify.push(user);
            }
            callback(null,usersmodify)
          })
        },
        function(callback){
          sysuserModel.count({},function(err,count){
            //查找系统内所有users的总数
            if (err) {
              console.log(err)
            }
            callback(null,count)

          })
        }
      ],function(err,results){
        if (err) {
          console.log(err)
        }
        var rows = results[0];
        var total = results[1];
        var result = {
          total:total,
          rows:rows
        }
        
        res.json(result);
      })
})

router.geet('/userlisttreegrid',function(req,res,next){
     res.render('./easyui/admin/userlist')
})
//封装用户treegrid数据接口
router.get('/getuserstreegrid',function(req,res,next){
    res.json([{
	"id":1,
	"name":"C",
	"size":"",
	"date":"02/19/2010",
	"children":[{
		"id":2,
		"name":"Program Files",
		"size":"120 MB",
		"date":"03/20/2010",
		"children":[{
			"id":21,
			"name":"Java",
			"size":"",
			"date":"01/13/2010",
			"state":"closed",
			"children":[{
				"id":211,
				"name":"java.exe",
				"size":"142 KB",
				"date":"01/13/2010"
			},{
				"id":212,
				"name":"jawt.dll",
				"size":"5 KB",
				"date":"01/13/2010"
			}]
		},{
			"id":22,
			"name":"MySQL",
			"size":"",
			"date":"01/13/2010",
			"state":"closed",
			"children":[{
				"id":221,
				"name":"my.ini",
				"size":"10 KB",
				"date":"02/26/2009"
			},{
				"id":222,
				"name":"my-huge.ini",
				"size":"5 KB",
				"date":"02/26/2009"
			},{
				"id":223,
				"name":"my-large.ini",
				"size":"5 KB",
				"date":"02/26/2009"
			}]
		}]
	},{
		"id":3,
		"name":"eclipse",
		"size":"",
		"date":"01/20/2010",
		"children":[{
			"id":31,
			"name":"eclipse.exe",
			"size":"56 KB",
			"date":"05/19/2009"
		},{
			"id":32,
			"name":"eclipse.ini",
			"size":"1 KB",
			"date":"04/20/2010"
		},{
			"id":33,
			"name":"notice.html",
			"size":"7 KB",
			"date":"03/17/2005"
		}]
	}]
}])
})

module.exports = router;