var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var enumberableconstants = require('../models/enumerableConstants');
var config={
  token: enumberableconstants.wechatinfo.token,
  appid: enumberableconstants.wechatinfo.appid,
  encodingAESKey: enumberableconstants.wechatinfo.encodingAESKey
};
// module.exports= wechat(config, function (req, res, next) {
//   // 微信输入信息都在req.weixin上
//   var message = req.weixin;
//   console.log(message);
//   res.reply('Hello world!');
// });

//一旦启用这个，用户发给公众号的信息、扫码事件都可以被这个接口获取
module.exports= wechat(config).text(function(message,req,res,net){
  console.log(message);
  res.reply(Date.now());
}).image(function(message,req,res,net){
    res.reply('收到了图片！')
  
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
  console.log('event:'+JSON.stringify(message));
  
}).device_text(function (message, req, res, next) {
  // TODO
}).device_event(function (message, req, res, next) {
  // TODO
}).middlewarify();