var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var locationSchema = new Schema({
	"company" : String,
	"name" : String,
	"tele" : String,
	"postcode" : String,
	"provincename" : String,
	"cityname" : String,
	"expareaname" : String,
	"address" : String,
	"userid" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'fan'
	},
	"type":String,
	"status":String//地址状态
});

module.exports = mongoose.model('location', locationSchema);