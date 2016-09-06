var express = require('express');
var router = express.Router();
var sysuserController = require('../controllers/sysuserController')
var sysorderController = require('../controllers/sysorderController');
var enumerableConstants = require('../models/enumerableConstants')
var sysuserModel = require('../models/sysuserModel');
var sysorderModel = require('../models/sysorderModel');
var async = require('async');
var moment = require('moment')

  router.get('/usercenter',isLogedIn,function(req,res,next){
    res.render('./contents/usercenter');
  })

  router.get('/admindash',isLogedIn,function(req,res,next){
     var dateArray = []

    for (var index =6; index >=0; index--) {
        dateArray.push(
            (moment().add(-index,'days').format('M月D号'))
            )
    }

    sysorderController.gettotalTodayOrderCount(function (err, result) {
        console.log(JSON.stringify(result));
        res.render('./contents/admindash', { weekdata: result, datearray: dateArray});
    })

  })

//管理员的快递员列表
router.get('/userlist',isLogedIn,function (req,res,next) {
  var currentPage = req.query.p;
  //console.log(currentPage);
  
  sysuserController.list(currentPage,{},function (err,count,users) {
    var TotalPages= Math.ceil(count/10);//向上整除，向下整除： Math.floor
    
    //这里主要是为了实现分页功能，实现一个对象数组，通过userlist页面的each来显示
    var pagesArray=[];
    for(var i=1;i<=TotalPages;i++){
      pagesArray.push({p:i});
    }
    
    console.log("totalpages:"+TotalPages);
    console.log("pagesArray:"+pagesArray);
    res.render('./contents/userlist',{
      users:users,
      pagesArray:pagesArray
    });
  });
  
});


//用户详情页路由
router.get('/userdetail',isLogedIn,function (req,res,next) {
  var id = req.query.id;

  sysuserModel.findOne({_id:id},function(err,user){
    if(err) console.log(err);
    console.log("user:"+user);
    
    if(user.usertype!=enumerableConstants.usertype.sysadmin && user.orgid!=null){
      sysuserModel.findOne({_id:user.orgid},function(err,orginfo){
        user.orgmobile = orginfo.mobile;
        res.render('./contents/userdetail',{
        user:user,
        helpers:{
        getUsertype:function(type){
          var typename='';
          switch(type){
            case '1':typename='系统管理员';break;
            case '2':typename='快递点';break;
            case '3':typename='快递员';break;
            default:break;
          }
          return typename;
        },
        getCompany:function(user){
          if(user.usertype!='1' && user.type!='' && user.type!=null){
            return enumerableConstants.expCompany[user.type].name;
          }
          else
            return '';
        }
      }
      });
      })
    }
    else{
      user.orgmobile ='尚未绑定快递点'
      res.render('./contents/userdetail',{
      user:user,
      helpers:{
        getUsertype:function(type){
          var typename='';
          switch(type){
            case '1':typename='系统管理员';break;
            case '2':typename='快递点';break;
            case '3':typename='快递员';break;
            default:break;
          }
          return typename;
        },
        getCompany:function(user){
          if(user.usertype!='1' && user.type!='' && user.type!=null){
            return enumerableConstants.expCompany[user.type].name;
          }
          else
            return '管理员无公司设置';
        }
      }
      });
    }  
  })
});


//用户详情修改
router.get('/usermodify',isLogedIn,function(req,res,next){
  var id = req.query.id;
  var usertypeObj={
    sysadmin:false,
    org:false,
    courier:false
  }

  async.series([
    function(callback){
    //查找所有的快递点，作为快递点的选择框使用
    sysuserModel.find({usertype:'2'},function(err,orgs){
        if(err) console.log(err);
        callback(null,orgs);
    })
    },
    function(callback){
      sysuserModel.findOne({_id:id},function(err,user){
          if(err) console.log(err);

          var usertype = user.usertype;
          //用户类型
          if(usertype!=null){
            switch(usertype){
              case '1':
                    usertypeObj.sysadmin = 'checked';
                    usertypeObj.org = null;
                    usertypeObj.courier = null;
                    break;
              case '2':
                    usertypeObj.sysadmin = null;
                    usertypeObj.org = 'checked';
                    usertypeObj.courier = null;
                    break;
              case '3':
                    usertypeObj.sysadmin = null;
                    usertypeObj.org = null;
                    usertypeObj.courier = 'checked';
                    break;
              default:
                    break;
            }  
          }
          //用户所属快递公司
          var typeIndex = 0;
          if(user.type!=''){
            typeIndex = user.type;
          }

          var result2 = {
            'user':user,
            'usertypeObj':usertypeObj,
            'typeIndex':typeIndex,
            'types':enumerableConstants.expCompany
          }
          if(err) console.log(err);
          callback(null,result2);

        })
    }
  ],function(err,results){
    console.log("result[0]:"+results[0]);
    console.log("result[1]:"+results[1].user);
    var orginfomobile = "";
    if(results[1].user.orgid==null){  
           res.render('./contents/usermodify',{
              user:results[1].user,
              usertypeObj:results[1].usertypeObj,
              typeIndex:results[1].typeIndex,
              types:results[1].types,
              orgs:results[0],
              userstatus:enumerableConstants.userstatus,
              helpers: {
                    type: function (num) {
                        if(num==results[1].typeIndex ){
                          return 'checked';
                        }
                        else {
                          return null;
                        }
                      },
                      org:function(){
                        return orginfomobile;          
                            
                      },
                      userstatushelper:function(statusnum){
                        if(statusnum=='' || statusnum==null){
                             return ''                       
                        }
                         else{
                                return enumerableConstants.userstatus[statusnum-1].status;
                         }
                       }
                          
                      
                }
              });  
    }else{
    sysuserModel.findOne({_id:results[1].user.orgid},function(err,orginfo){
                  if(err) console.log(err);
                  console.log("orginfo:"+orginfo)
         orginfomobile= orginfo.mobile;      
         
              res.render('./contents/usermodify',{
              user:results[1].user,
              usertypeObj:results[1].usertypeObj,
              typeIndex:results[1].typeIndex,
              types:results[1].types,
              orgs:results[0],
              orginfomobile:orginfomobile,
              userstatus:enumerableConstants.userstatus,
              helpers: {
                    type: function (num) {
                        if(num==results[1].typeIndex ){
                          return 'checked';
                        }
                        else {
                          return null;
                        }
                      },
                      org:function(){
                        return orginfomobile;          
                            
                      },
                      userstatushelper:function(statusnum){
                        if(statusnum=='' || statusnum==null){
                             return ''                       
                        }
                         else{
                                return enumerableConstants.userstatus[statusnum-1].status;
                         }
                       }
                          
                      
                }
              });
     })
     }

  
  })
 
})

//用户数据修改post
router.post('/usermodify',function(req,res,next){
  console.log(req.body);
  var orgid = req.body.orgid;

  var id = req.query.id;

  var user={
    mobile:req.body.mobile,//手机号
    usertype:req.body.usertype,//用户类型
    type:req.body.type,//所属公司
    account:req.body.account,//面单账号
    accountpsd:req.body.accountpsd,//面单密码
    count:req.body.count,//剩余单数
    status:req.body.status,//当前状态
    title:req.body.title,//标题
    username:req.body.username
  }
  if(req.body.usertype!='2' || req.body.usertype!=2){
    user.type=0;
  }

  if(orgid==null || orgid ==''){
          sysuserController.modify(id,user,function(err,result){
        if(err) {
          req.flash('error_msg',err.error)
          res.redirect('/admin/usermodify?id='+id);
        }else{
          req.flash('sucess_msg','修改成功！')
          res.redirect('/admin/usermodify?id='+id);
        }
        
      })
  }else{
    sysuserModel.findOne({_id:orgid},function(err,orgUser){
      user.orgid =orgUser._id;//查询objectid
      //根据id查询doc，然后更新该用户信息
      sysuserController.modify(id,user,function(err,result){
        if(err) {
          req.flash('error_msg',err.error)
          res.redirect('/admin/usermodify?id='+id);
        }else{
          req.flash('sucess_msg','修改成功！')
          res.redirect('/admin/userdetail?id='+id);
        }       
      })
  })
  }
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
