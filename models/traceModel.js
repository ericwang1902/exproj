var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var traceSchema = new Schema({	"AcceptTime" : String,	"AcceptStation" : String,	"Remark" : String,	"orderId" : {	 	type: Schema.Types.ObjectId,	 	ref: 'sysorder'	}});

module.exports = mongoose.model('trace', traceSchema);