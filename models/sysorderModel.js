var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var sysorderSchema = new Schema({
	"status" : String,//enumberableConstants.orderstatus
	"logisticorder" : String,////下单给快递鸟的时候设置
	"fanopenid":String,//创建的order的时候获取
	"courierid" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'sysuser'
	},
	"orgid" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'sysuser'
	},//创建的order的时候获取
	"logs" : Array,
	"customername" : String,//下单给快递鸟的时候设置
	"customerpwd" : String,//下单给快递鸟的时候设置
	"sendsite" : String,//下单给快递鸟的时候设置
	"shippercode" : String,//下单给快递鸟的时候设置
	"ordercode" : String,//系统内的订单编号
	"paytype" : String,//下单给快递鸟的时候设置
	"exptype" : String,//下单给快递鸟的时候设置
	"receiveid" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'location'
	},//创建的order的时候获取
	"sendid" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'location'
	},//创建的order的时候获取
	"goodsname" : String,//创建的order的时候获取
	"goodsdes":String,//创建的order的时候获取
	"isreturnprinttemplate" : String,//下单给快递鸟的时候设置
	"ebusinessid" : String,//下单给快递鸟的时候设置
	"requesttype" : String,//下单给快递鸟的时候设置
	"datasign" : String,//下单给快递鸟的时候设置
	"datatype" : String,//下单给快递鸟的时候设置
	"orderdate":Date,//下单的时间
	"template":String,//下单成功之后，电子面单的模板
	"trace":Object//快递路径
});

module.exports = mongoose.model('sysorder', sysorderSchema);