var express = require('express');
var router = express.Router();
var sysuserController = require('../controllers/sysuserController')
var sysorderController = require('../controllers/sysorderController');
var enumerableConstants = require('../models/enumerableConstants')
var sysuserModel = require('../models/sysuserModel');
var sysorderModel = require('../models/sysorderModel');
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