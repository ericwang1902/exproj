var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var chargeSchema = new Schema({

module.exports = mongoose.model('charge', chargeSchema);