var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var fanSchema = new Schema({

module.exports = mongoose.model('fan', fanSchema);