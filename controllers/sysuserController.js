var sysuserModel = require('../models/sysuserModel.js');
var bcrypt = require('bcryptjs');
var async = require("async");
/**
 * sysuserController.js
 *
 * @description :: Server-side logic for managing sysusers.
 */
module.exports = {


    /**
     * sysuserController.list()
     */
    list: function(page,condition,callback2) {
        var pageItems = 10;//每页的数量
        
        
        async.series([
            function(callback){
                
               sysuserModel.count(condition,function(err,count){
                    if(err)console.log(err);  
                    callback(null,count);
                })
                
            },
            function(callback){
                sysuserModel.find(condition,function(err,sysuers){
                    if(err) console.log(err);
                     console.log('sysuers:'+sysuers);
                    callback(null,sysuers);
                }).skip((page-1)*pageItems).limit(pageItems);
            }
        ],function(err,results){
            //console.log(results);
            callback2(null,results[0],results[1]);
        });
          
       
        
    },
    /**
   *查找orgid下面的所有快递员 
   */
  orglist:function(page,condition,callback2){
      var pageItems = 10;//每页显示的数量

      async.series([
        function(callback){
            sysuserModel.count(condition,function(err,count){
                if(err) console.log(err);
             //   console.log('orglist count:'+count);
                callback(null,count);
            })
        },
        function(callback){
            sysuserModel.find(condition,function(err,sysuers){
                if(err) console.log(err);
             //   console.log('sysuers:'+sysuers);
                callback(null,sysuers);
            }).skip((page-1)*pageItems).limit(pageItems);
        }
      ],function(err,results){
          console.log(results);
        callback2(null,results[0],results[1]);
      })


  },
  orguserdetail:function(id,callback){
    sysuserModel.findOne({_id:id},function (err,result) {
        console.log(id);
        if(err) console.log(err);

        callback(null,result);
    })
  },
    

    /**
     * sysuserController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        sysuserModel.findOne({_id: id}, function(err, sysuser){
            if(err) {
                return res.json(500, {
                    message: 'Error getting sysuser.'
                });
            }
            if(!sysuser) {
                return res.json(404, {
                    message: 'No such sysuser'
                });
            }
            return res.json(sysuser);
        });
    },

    //用户注册，创建用户
    createUser:function(user,callback){
        var sysuser = new sysuserModel({
            mobile:user.username,
            psd:user.psd,
            usertype : "",
            openid : "",
            count : 0,
            type : "",
            account : "",
            accountpsd : "",
            orgid : null,
            groupid : "",
            status : "1",
            isbroadcast : "",
            title:"",
            username:""
        });
        
        sysuserModel.findOne({mobile:user.username},function(err,user){
            if(err) return console.error(err);
           
            if(user){
                console.log('改号码已被占用！')
            }else{
                console.log('可以创建！')
                bcrypt.genSalt(10,function(err,salt){
                   bcrypt.hash(sysuser.psd,salt,function(err,hash){
                       sysuser.psd = hash;
                       
                       sysuser.save(function(err,user){
                           if(err) return console.error(err);
                          // console.log(user);
                           callback(null,user);
                       })
                   })
                })
            }
            
        })
    },
    /**
     * sysuserController.create()
     */
    create: function(req, res) {
        var sysuser = new sysuserModel({
			mobile : req.body.mobile,
			psd : req.body.psd,
			usertype : req.body.usertype,
			openid : req.body.openid,
			count : req.body.count,
			type : req.body.type,
			account : req.body.account,
			accountpsd : req.body.accountpsd,
			orgid : req.body.orgid,
			groupid : req.body.groupid,
			status : req.body.status,
			isbroadcast : req.body.isbroadcast
        });
        

        sysuser.save(function(err, sysuser){
            if(err) {
                return res.json(500, {
                    message: 'Error saving sysuser',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: sysuser._id
            });
        });
    },

    /**
     * sysuserController.update()
     */
    update: function(req,res, callback) {
        var id = req.query.id;


        sysuserModel.findOne({_id: id}, function(err, sysuser){
            if(err) {
                callback(err,null);
            }
            if(!sysuser) {
                callback(null,'no user');
            }

            sysuser.mobile =  req.body.mobile ? req.body.mobile : sysuser.mobile;
			sysuser.psd =  req.body.psd ? req.body.psd : sysuser.psd;
			sysuser.usertype =  req.body.usertype ? req.body.usertype : sysuser.usertype;
			sysuser.openid =  req.body.openid ? req.body.openid : sysuser.openid;
			sysuser.count =  sysuser.count;//不让修改剩余单数
			sysuser.type =  req.body.type ? req.body.type : sysuser.type;
			sysuser.account =  req.body.account ? req.body.account : sysuser.account;
			sysuser.accountpsd =  req.body.accountpsd ? req.body.accountpsd : sysuser.accountpsd;
			sysuser.orgid =  req.body.orgid ? req.body.orgid : sysuser.orgid;
			sysuser.groupid =  req.body.groupid ? req.body.groupid : sysuser.groupid;
			sysuser.status =  req.body.status ? req.body.status : sysuser.status;
			sysuser.isbroadcast =  req.body.isbroadcast ? req.body.isbroadcast : sysuser.isbroadcast;
			sysuser.title = req.body.title ? req.body.title : sysuser.title;
            sysuser.username = req.body.username ? req.body.username :sysuser.username;

            sysuser.save(function(err, sysuser){
                if(err) {
                callback(err,null);
                }
                if(!sysuser) {
                callback(null,'no user');
                }
               callback(null,sysuser);
            });
        });
    },

    modify: function(id,userinfo,callback){
        sysuserModel.findOne({_id:id},function(err,user){
            if(err) callback({error:err.message+"1"},null);
            if(!user) callback({error:"不存在该用户"},null);

            user.mobile = userinfo.mobile;
            user.usertype = userinfo.usertype;
            user.type = userinfo.type;
            user.account = userinfo.account;
            user.accountpsd = userinfo.accountpsd;
            user.count = user.count;//不让修改剩余单数
            user.orgid = userinfo.orgid;
            user.status = userinfo.status;
            user.title =userinfo.title;
            user.username = userinfo.username;

            user.save(function(err,sysuer){
               if(err) callback({error:err.message+"2"},null);
               callback(null,sysuer);
            })

        })
    },

    /**
     * sysuserController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        sysuserModel.findByIdAndRemove(id, function(err, sysuser){
            if(err) {
                return res.json(500, {
                    message: 'Error getting sysuser.'
                });
            }
            return res.json(sysuser);
        });
    }
};