var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var chargeSchema = new Schema({	"orgid" : {	 	type: Schema.Types.ObjectId,	 	ref: 'sysuser'	},	"amount" : Number,	"chargedate" : Date});

module.exports = mongoose.model('charge', chargeSchema);