var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var sysuserSchema = new Schema({
	"mobile" : String,//电话 1
	"psd" : String,//密码
	"usertype" : String,//用户类型 1
	"openid" : String,//微信Openid
	"count" : Number,//剩余单数 1
	"type" : String,//所属快递公司 1
	"account" : String,//电子面单账号 1
	"accountpsd" : String,//电子面单密码
	"orgid" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'sysuser'
	},//所属快递点id
	"groupid" : String,//用户分组，用于微信菜单
	"status" : String,//设置工作状态，冻结、正常、余额不足 1
	"isbroadcast" : String//针对org的设置项
});

module.exports = mongoose.model('sysuser', sysuserSchema);