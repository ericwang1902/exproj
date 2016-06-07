var mongoose = require('mongoose');
var sysuserModel = require('./sysuserModel');
var bcrypt = require('bcryptjs');

var sysadmin = {
        mobile:"admin888",
        psd:"admin888",
        usertype : "sysadmin",
	    openid : "",
		count : 0,
		type : "",
		account : "",
		accountpsd : "",
		//orgid : "",
		groupid : "",
		status : "",
		isbroadcast : ""
}

var name = "admin888";
sysuserModel.findOne({mobile:name},function (err,user) {
    if(err){
        return console.error(err);
    }
    
    if(!user){
        
       bcrypt.genSalt(10,function (err,salt) {
           bcrypt.hash(sysadmin.psd,salt,function(err,hash){
            sysadmin.psd = hash;
            
            //存储
            var sysdoc = new sysuserModel(sysadmin);
            sysdoc.save(function(err,user){
            if(err)return console.error(err);
            console.log(user);
            });
            
         })
       });
    }else{
        console.log("已经有系统管理员账号了！")
    }
    
})

