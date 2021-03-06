var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var fanSchema = new Schema({
	"openid" : String,
	"orgid" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'sysuser'
	},//默认寄件受理点
	"defaultsend":{
	 	type: Schema.Types.ObjectId,
	 	ref: 'location'
	},//默认寄件地址
	"sendlist" : Array,
	"receivelist" : Array
});

module.exports = mongoose.model('fan', fanSchema);