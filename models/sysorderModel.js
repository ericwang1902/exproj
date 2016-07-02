var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var sysorderSchema = new Schema({
	"status" : String,//enumberableConstants.orderstatus
	"logisticorder" : String,//快递单号
	"courierid" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'sysuser'
	},
	"orgid" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'sysuser'
	},
	"logs" : Array,
	"customername" : String,
	"customerpwd" : String,
	"sendsite" : String,
	"shippercode" : String,
	"ordercode" : String,//系统内的订单编号
	"paytype" : String,
	"exptype" : String,
	"receiveid" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'location'
	},
	"sendid" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'location'
	},
	"goodsname" : String,
	"goodsdes":String,//后加的属性
	"isreturnprinttemplate" : String,
	"ebusinessid" : String,
	"requesttype" : String,
	"datasign" : String,
	"datatype" : String
});

module.exports = mongoose.model('sysorder', sysorderSchema);