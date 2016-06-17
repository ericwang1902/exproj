var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var config={
  token: 'exproj',
  appid: 'wx45eb07597f1e004a',
  encodingAESKey: '12RQxjmBlNmQ8HwKRb654CaUPWzx3TjyfFSEZXOhEJD'
};
// module.exports= wechat(config, function (req, res, next) {
//   // 微信输入信息都在req.weixin上
//   var message = req.weixin;
//   console.log(message);
//   res.reply('Hello world!');
// });

module.exports= wechat(config).text(function(message,req,res,net){
  console.log(message);
  res.reply('更简化的API设计！');
}).image(function(message,req,res,net){
  
}).voice(function (message, req, res, next) {
  // TODO
}).video(function (message, req, res, next) {
  // TODO
}).location(function (message, req, res, next) {
  // TODO
}).link(function (message, req, res, next) {
  // TODO
}).event(function (message, req, res, next) {
  // TODO
}).device_text(function (message, req, res, next) {
  // TODO
}).device_event(function (message, req, res, next) {
  // TODO
}).middlewarify();