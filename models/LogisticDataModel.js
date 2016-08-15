var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var LogisticDataSchema = new Schema({
	"EBusinessID" : String,
	"OrderCode" : String,
	"ShipperCode" : String,
	"LogisticCode" : String,
	"Success" : Boolean,
	"Reason" : String,
	"State" : String,
	"CallBack" : String,
	"Traces" : Array
});

module.exports = mongoose.model('LogisticData', LogisticDataSchema);