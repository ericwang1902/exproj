var kdniao = require('../controllers/kdniao');
var enumerableconstants = require('../models/enumerableConstants')
var  utils = require('utility');
var utf8 = require('utf8')
var request =require('request');
var orderoptions =require('../controllers/orderoptions');

var requestdata ='{"OrderCode":"2p271g6zaiqc0yost","ShipperCode":"YTO","CustomerName":"K10101010","MonthCode":"123456","PayType":"1","LogisticCode":"","ExpType":"1","Sender":{"Company":"花木大世界网","Name":"王海军","Mobile":"15715161519","PostCode":"226500","ProvinceName":"江苏省","CityName":"南通市","ExpAreaName":"如皋市","Address":"如城镇万寿南路999号"},"Receiver":{"Company":"李四的地址","Name":"李四","Mobile":"15715161519","PostCode":"226500","ProvinceName":"北京市","CityName":"北京市市辖区","ExpAreaName":"东城区","Address":"详细收件地址"},"Commodity":[{"GoodsName":"鞋子","GoodsDesc":""}],"IsReturnPrintTemplate":"1"}'
var apikey = enumerableconstants.kdniao.apikey;

//console.log('加密测试：'+kdniao.dataSign(requestdata,apikey))



            var ebusinessid =enumerableconstants.kdniao.businessid;
            var requestype = '1007';
            var requestdatautf8 = kdniao.requestData(requestdata);
            var datasign = kdniao.dataSign(requestdata,enumerableconstants.kdniao.apikey)
            var datatype = 2;//json格式
            
           var orderoptions={
                url:enumerableconstants.kdniao.apiurl,
                method:'POST',
                json:true,
                body:{
                    RequestData:requestdatautf8,
                    EBusinessID:ebusinessid,
                    RequestType:requestype,
                    DataSign:datasign,
                    DataType:datatype
                    }
                }
                
           console.log('测试orderoptions～～～～～～:'+orderoptions);


          request(orderoptions,function(err,response,body){
              console.log('~~~~~~~~~~~~~~'+JSON.stringify(body));
              //需要在返回的数据中获取物流运单号
             
          })