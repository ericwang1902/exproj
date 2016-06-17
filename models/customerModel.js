var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var customerSchema = new Schema({	"openid" : String,	"courierid" : String,	"username" : String,	"psd" : String});

module.exports = mongoose.model('customer', customerSchema);