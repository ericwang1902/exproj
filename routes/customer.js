var express = require('express');
var router = express.Router();
var wechatjs = require('../controllers/wechatapi');//调用wechatjs来设置
var request =require('request');
var enumerableconstants = require('../models/enumerableConstants')
var async = require('async');
var locationController = require('../controllers/locationController');
var fanModel =require('../models/fanModel');
var locationModel = require('../models/locationModel');
var sysuserModel = require('../models/sysuserModel');

router.get('/order1',function (req,res,next) {
    res.render('./customer/order1',{layout: false});
})

router.post('/createorder',function (req,res,next) {
    console.log(req.body);
})

router.get('/location',getuserinfo,function (req,res,next) {
    //进入到这个页面的时候，通过授权来获取用户信息
    var userinfo =req.userinfoJson;
    userinfo.openid = req.query.openid;
    res.render('./customer/location',{layout:false,userinfo:req.userinfoJson});
})

router.post('/location',function(req,res,next){

    //console.log(req.body);
    
    if(req.query.t =='0'){
        console.log("req.query.t="+req.query.t);
        //新增地址
        async.waterfall([
            //获取地址所对应的粉丝,获取到userid
            function(callback) {
                fanModel.findOne({openid:req.body.openid},function (err,fan) {
                    if(err) console.log(err);

                    if(!fan){
                        //创建粉丝数据
                        var fan = new fanModel({
                            openid:req.body.openid
                        })
                        fan.save(function (err,fan) {
                            if(err) console.log(err);
                            
                            callback(null, fan);
                        })
                    }else{
                        //已经有粉丝了
                        callback(null, fan);
                    }     
                })          
            },
            //添加地址数据
            function(fan, callback) {
            // arg1 now equals 'one' and arg2 now equals 'two'
                var location = {
                    company:req.body.company,
                    name:req.body.name,
                    tele : req.body.tele,
                    postcode : req.body.postcode,
                    provincename : req.body.provincename,
                    cityname : req.body.cityname,
                    expareaname : req.body.expareaname,
                    address : req.body.address,
                    userid : fan._id,
                    type:req.body.type
                };
                var loc = new locationModel(location)
                
                loc.save(function(err,loc){
                    if(err) 
                    {
                        console.log(err);
                        callback(null, 0);
                    }
                    else{
                        callback(null, 5);
                    }
                })
            }
        ], function (err, result) {
            // result now equals 'done'
            res.redirect('/courier/resultinfo?result='+result+'&openid='+req.body.openid);
        });
    }
    else if(req.query.t=='1'){
        //修改地址
        console.log(req.query.locid);
        locationModel.findOne({_id:req.query.locid},function(err,location){
            if(err) console.log(err);
            console.log('location:'+location);
            
            location.company =  req.body.company ? req.body.company : location.company;
			location.name =  req.body.name ? req.body.name : location.name;
			location.tele =  req.body.tele ? req.body.tele : location.tele;
			location.postcode =  req.body.postcode ? req.body.postcode : location.postcode;
			location.provincename =  req.body.provincename ? req.body.provincename : location.provincename;
			location.cityname =  req.body.cityname ? req.body.cityname : location.cityname;
			location.expareaname =  req.body.expareaname ? req.body.expareaname : location.expareaname;
			location.address =  req.body.address ? req.body.address : location.address;
            
            location.save(function(err,loc){
              if(err)console.log(err);
              console.log('loc:'+loc);
               res.redirect('/courier/resultinfo?result=6&openid='+req.body.openid);
            })
            
        })
    }
    
})


router.get('/loclist',function(req,res,next){
    //所有的入口都放在send里，从那里开始传递openid
     var openid = req.query.openid;
     
     
     //根据openid查找userid，根据userid查找收件地址列表
         async.waterfall([
        //获取地址所对应的粉丝,获取到userid
        function(callback) {
            fanModel.findOne({openid:openid},function (err,fan) {
                if(err) console.log(err);

                if(!fan){
                    //创建粉丝数据
                    var fan = new fanModel({
                        openid:openid
                    })
                    fan.save(function (err,fan) {
                        if(err) console.log(err);
                        
                        callback(null, fan);
                    })
                }else{
                    //已经有粉丝了
                     callback(null, fan);
                }     
            })          
        },
        //查找收件地址列表
        function(fan, callback) {
            locationModel.find({userid:fan._id,type:1},function(err,locs){
                callback(null,locs);
            })
        }
    ], function (err, result) {
        // result now equals 'done'
        res.render('./customer/loclist',{layout:false,locs:result,openid:openid});
    });
     
   
})

router.get('/loclist2',function(req,res,next){
    //所有的入口都放在send里，从那里开始传递openid
     var openid = req.query.openid;
     
     
     //根据openid查找userid，根据userid查找收件地址列表
         async.waterfall([
        //获取地址所对应的粉丝,获取到userid
        function(callback) {
            fanModel.findOne({openid:openid},function (err,fan) {
                if(err) console.log(err);

                if(!fan){
                    //创建粉丝数据
                    var fan = new fanModel({
                        openid:openid
                    })
                    fan.save(function (err,fan) {
                        if(err) console.log(err);
                        
                        callback(null, fan);
                    })
                }else{
                    //已经有粉丝了
                     callback(null, fan);
                }     
            })          
        },
        //查找收件地址列表
        function(fan, callback) {
            locationModel.find({userid:fan._id,type:2},function(err,locs){
                callback(null,locs);
            })
        }
    ], function (err, result) {
        // result now equals 'done'
        res.render('./customer/loclist2',{layout:false,locs:result,openid:openid});
    });
     
   
})

router.get('/defaultsend',function(req,res,next){
    var openid = req.query.openid || req.session.openid;//获取到当前用户的openid
    
       //根据openid查找userid，根据userid查找收件地址列表
         async.waterfall([
        //获取地址所对应的粉丝,获取到userid
        function(callback) {
            fanModel.findOne({openid:openid},function (err,fan) {
                if(err) console.log(err);

                if(!fan){
                    //创建粉丝数据
                    var fan = new fanModel({
                        openid:openid
                    })
                    fan.save(function (err,fan) {
                        if(err) console.log(err);
                        
                        callback(null, fan);
                    })
                }else{
                    //已经有粉丝了
                    console.log(fan);
                     callback(null, fan);
                }     
            })          
        },
        //查找寄件地址列表
        function(fan, callback) {
            locationModel.find({userid:fan._id,type:2},function(err,locs){
                callback(null,locs);
            })
        }
    ], function (err, result) {
        // result now equals 'done'
        console.log(result);
        res.render('./customer/defaultsend',{layout:false,locs:result,openid:openid});
    });
     
    
})

router.post('/defaultsend',function(req,res,next){
    var openid = req.query.openid || req.session.openid;//获取openid
    
    var defaultsendlocid = req.body.defaultsendradio;//获取表单提交来的locid
     
     //设置改openid的fan的defaultsend为defaultsendlocid   
    async.series([
        function(callback){
        //查找defaultsend的id
        locationModel.findOne({_id:defaultsendlocid},function(err,loc){
            if(err) console.log(err);
            console.log('defaultsendlocid:'+defaultsendlocid);
            console.log('defaultsend:'+loc);
            
            callback(null,loc);
        })
        
        },
        function(callback){
         //根据openid查找到fan
           fanModel.findOne({openid:openid},function(err,fan){
            if(err) console.log(err);
        
            callback(null,fan);
            })
        }
        
    ],function(err,results){
       //修改fan的查找defaultsend的id
       var fan= results[1];
       fan.defaultsend = results[0]._id;
       
        fan.save(function(err,fan){
           if(err) console.log(err);
           
           console.log('设置默认地址成功！');
           res.redirect('/courier/resultinfo?result=7&openid='+openid);
        
             
        })
       
    })
})

router.get('/defaultorg',function(req,res,next){
    var openid = req.query.openid || req.session.openid;
    
    //查找系统里的代理点
    sysuserModel.find({usertype:2},function(err,orgs){
        if(err) console.log(err);
        
        res.render('./customer/defaultorg',{
            layout:false,
            orgs:orgs,
            helpers:{
                getorgtype:function(type){
                    return enumerableconstants.expCompany[type].name;
                }
            }
        })
    })    
})

router.post('/defaultorg',function(req,res,next){
    var openid = req.query.openid || req.session.openid;
    var defaultorgid = req.body.defaultorgradio;
    
    async.series([
        function(callback){
            //查找到org的id
            sysuserModel.findOne({_id:defaultorgid},function(err,org){
                if(err) console.log(err);
                
                callback(null,org);
            })
            
        },
        function(callback){
            //查找到fan的doc
            fanModel.findOne({openid:openid},function(err,fan){
                if(err) console.log(err);
                
                callback(null,fan);
            })
        }
    ],function(err,results){
        var fan = results[1];
        var org = results[0];
        
        fan.orgid = org._id || fan.orgid;
        
        fan.save(function(err,fan){
            if(err) console.log(err);
            
            console.log(fan);
            console.log('默认快递代理点设置成功');
            
            res.redirect('/courier/resultinfo?result=8&openid='+openid);
        })
          
    })
    
    
    
})

//手机网页的入口，获取openid，创建用户
router.get('/send',getuserinfo,function(req,res,next){
      var userinfo =req.userinfoJson;

     userinfo.openid =req.query.openid||userinfo.openid;
     req.session.openid = userinfo.openid;
      var openid = req.session.openid ;
      
     console.log('send openid:'+userinfo.openid);
     
     async.series([
            function(callback){
                  //根据locid查找相应的location
                locationModel.findOne({_id:req.session.recieveloc},function(err,recieveloc){
                    if(err) console.log(err);
                    callback(null, recieveloc);
                })
                
            },
            function(callback){
                // do some more stuff ...
                locationModel.findOne({_id:req.session.sendloc},function(err,sendloc){
                    if(err) console.log(err);
                    callback(null, sendloc);
                })
            },
            function(callback) {
            fanModel.findOne({openid:userinfo.openid},function (err,fan) {
                if(err) console.log(err);

                if(!fan){
                    //创建粉丝数据
                    var fan = new fanModel({
                        openid:userinfo.openid
                    })
                    fan.save(function (err,fan) {
                        if(err) console.log(err);
                        
                        callback(null, fan);
                    })
                }else{
                    //已经有粉丝了
                     callback(null, fan);
                }     
            })          
        }
        ],
        // optional callback
        function(err, results){
            if(err)console.log(err);
            res.render('./customer/send',{layout:false,openid:openid,recieveloc:results[0],sendloc:results[1],fan:results[2]});
        });
})

router.post('/send',function(req,res,next){
    //获取openid
    var  openid = req.query.openid;
    if(req.query.type==1){
        var recievelocid = req.body.radio1;
        req.session.recieveloc = recievelocid;
    }else if(req.query.type==2){
        var sendlocid = req.body.radio2;
        req.session.sendloc = sendlocid;
    }
    console.log(req.body);//radio1:locid
    
            async.series([
            function(callback){
                  //根据locid查找相应的location
                locationModel.findOne({_id:req.session.recieveloc},function(err,recieveloc){
                    if(err) console.log(err);
                    callback(null, recieveloc);
                })
                
            },
            function(callback){
                // do some more stuff ...
                locationModel.findOne({_id:req.session.sendloc},function(err,sendloc){
                    if(err) console.log(err);
                    callback(null, sendloc);
                })
            }
        ],
        // optional callback
        function(err, results){
            if(err)console.log(err);
            res.render('./customer/send',{layout:false,openid:openid,recieveloc:results[0],sendloc:results[1]});
        });
    
})

router.get('/sendrecord',function(req,res,next){
    var openid = req.query.openid;
    res.render('./customer/sendrecord',{layout:false,openid:openid});
})

router.get('/locnav',function(req,res,next){
    var openid = req.query.openid;
    
    res.render('./customer/locnav',{layout:false,openid:openid});
})

router.get('/locdetail',function(req,res,next){
    var userid = req.query.userid;
    var locid = req.query.locid;//获取相应的locid
    console.log("locid:"+locid);
    var openid = req.session.openid ;
    
        async.series([
            function(callback){
                  //根据locid查找相应的location
                locationModel.findOne({_id:locid},function(err,loc){
                    if(err) console.log(err);
                    callback(null, loc);
                })
                
            },
            function(callback){
                // do some more stuff ...
                fanModel.findOne({_id:userid},function(err,user){
                    if(err) console.log(err);
                    callback(err,user);
                })
            }
        ],
        // optional callback
        function(err, results){
            // results is now equal to ['one', 'two']
            res.render('./customer/locdetail',{
            layout:false,
            openid:openid,//results[1].openid
            location:results[0],
            locid:locid,
            helpers:{
                gettype:function(type){
                    if(type=='1')
                    return '收件地址';
                    if(type=='2')
                    return '寄件地址';
                }
            }
            })
        });
  })
  
  
  router.get('/recievelist',function(req,res,next){
     // var openid = req.query.openid;
      var openid = req.session.openid ;
       //根据openid查找userid，根据userid查找收件地址列表
         async.waterfall([
        //获取地址所对应的粉丝,获取到userid
        function(callback) {
            fanModel.findOne({openid:openid},function (err,fan) {
                if(err) console.log(err);

                if(!fan){
                    //创建粉丝数据
                    var fan = new fanModel({
                        openid:openid
                    })
                    fan.save(function (err,fan) {
                        if(err) console.log(err);
                        
                        callback(null, fan);
                    })
                }else{
                    //已经有粉丝了
                    console.log(fan);
                     callback(null, fan);
                }     
            })          
        },
        //查找收件地址列表
        function(fan, callback) {
            locationModel.find({userid:fan._id,type:1},function(err,locs){
                callback(null,locs);
            })
        }
    ], function (err, result) {
        // result now equals 'done'
        console.log(result);
        res.render('./customer/recievelist',{layout:false,locs:result,openid:openid});
    });
  })

router.get('/sendlist',function(req,res,next){
     // var openid = req.query.openid;
      var openid = req.session.openid ;
       //根据openid查找userid，根据userid查找收件地址列表
         async.waterfall([
        //获取地址所对应的粉丝,获取到userid
        function(callback) {
            fanModel.findOne({openid:openid},function (err,fan) {
                if(err) console.log(err);

                if(!fan){
                    //创建粉丝数据
                    var fan = new fanModel({
                        openid:openid
                    })
                    fan.save(function (err,fan) {
                        if(err) console.log(err);
                        
                        callback(null, fan);
                    })
                }else{
                    //已经有粉丝了
                    console.log(fan);
                     callback(null, fan);
                }     
            })          
        },
        //查找寄件地址列表
        function(fan, callback) {
            locationModel.find({userid:fan._id,type:2},function(err,locs){
                callback(null,locs);
            })
        }
    ], function (err, result) {
        // result now equals 'done'
        console.log(result);
        res.render('./customer/sendlist',{layout:false,locs:result,openid:openid});
    });
  })
  
  
  router.get('/setting',function(req,res,next){
     // var openid = req.query.openid;
      var openid = req.session.openid || req.query.openid ;
      
      async.waterfall([
          function(callback){
           //查找用户数据
           fanModel.findOne({openid:openid},function(err,fan){
             if(err) console.log(err);
             
             callback(null,fan);  
           })
          },
          function(fan,callback){
          //查找默认寄件地址信息    
          locationModel.findOne({_id:fan.defaultsend},function(err,loc){
             if(err) console.log(err);
            
             callback(null,fan,loc)               
          })
          },
          function(fan,loc,callback){
           //查找fan的默认快递点的信息
            sysuserModel.findOne({_id:fan.orgid},function(err,sysuser){
                if(err) console.log(err);
                
                var result = {
                    sysuser:sysuser,
                    loc:loc
                }
                
                callback(null,result);
            })   
          }
      ],function(err,result){
          if(err) console.log(err);
          
          res.render('./customer/setting',{
              layout:false,
              openid:openid,
              defaultsend:result.loc,
              defaultorg:result.sysuser
            //   helpers:{
            //     getorgtype:function(type){
            //         return enumerableconstants.expCompany[type].name;
            //     }
            // }
        });
      })     
  })



//通过用户授权，获取微信jstoken和用户信息
function getuserinfo(req,res,next){
    console.log('code:'+req.query.code);//获取微信重定向之后，生成的code 
    async.waterfall([
    //获取accesstoken
    function(callback) {
        var accesstokenoptions={
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+enumerableconstants.wechatinfo.appid+'&secret='+enumerableconstants.wechatinfo.appsecret+'&code='+req.query.code+'&grant_type=authorization_code'
        }
        request(accesstokenoptions,function (error,response,body) { 
            var bodyJson = JSON.parse(body);//转成json对象 
            var access_token = bodyJson.access_token;
            var refresh_token = bodyJson.refresh_token;
            var openid=bodyJson.openid;
            console.log('access_token:'+access_token);
            console.log('refresh_token:'+refresh_token);
            console.log('openid:'+openid);
          callback(null, access_token,refresh_token,openid);
        })    
    },
    //获取用户信息
    function(access_token, refresh_token,openid, callback) {
            console.log('access_token:'+access_token);
            console.log('refresh_token:'+refresh_token);
            console.log('openid:'+openid);
            wechatjs.sendtext(openid,'hello');//客服消息，互动48小时内有效
            var userinfooptions = {
                url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN'
            }
            //这个body就是用户信息
            request(userinfooptions,function (error,response,body) {
             
            callback(null, body);
            })      
    }
], function (err, result) {
    // result now equals 'done'
    console.log(result);
    var userinfoJson = JSON.parse(result);
    req.userinfoJson = userinfoJson;
    
     return next();
});
    
   
}


module.exports = router;