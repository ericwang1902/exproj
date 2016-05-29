var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var sysuserSchema = new Schema({	"mobile" : String,	"psd" : String,	"usertype" : String,	"openid" : String,	"count" : Number,	"type" : String,	"account" : String,	"accountpsd" : String,	"orgid" : {	 	type: Schema.Types.ObjectId,	 	ref: 'sysuser'	},	"groupid" : String,	"status" : String,	"isbroadcast" : String});

module.exports = mongoose.model('sysuser', sysuserSchema);