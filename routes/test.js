var kdniao = require('../controllers/kdniao');
var enumerableconstants = require('../models/enumerableConstants')
var  utils = require('utility');
var utf8 = require('utf8')

var requestdata ='{"OrderCode":"2p271g6zaiqc0yost","ShipperCode":"YTO","CustomerName":"K10101010","MonthCode":"123456","PayType":"1","LogisticCode":"","ExpType":"1","Sender":{"Company":"花木大世界网","Name":"王海军","Mobile":"15715161519","PostCode":"226500","ProvinceName":"江苏省","CityName":"南通市","ExpAreaName":"如皋市","Address":"如城镇万寿南路999号"},"Receiver":{"Company":"李四的地址","Name":"李四","Mobile":"15715161519","PostCode":"226500","ProvinceName":"北京市","CityName":"北京市市辖区","ExpAreaName":"东城区","Address":"详细收件地址"},"Commodity":[{"GoodsName":"鞋子","GoodsDesc":""}],"IsReturnPrintTemplate":"1"}'
var apikey = enumerableconstants.kdniao.apikey;

//console.log('加密测试：'+kdniao.dataSign(requestdata,apikey))


console.log('测试～～～～～～:'+kdniao.dataSign(JSON.stringify(requestdata),enumerableconstants.kdniao.apikey));