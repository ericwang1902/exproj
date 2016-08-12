var enumerableconstants = require('../models/enumerableConstants')
var kdniao =require('./kdniao')

module.exports={
   //圆通快递的电子面单账号配置，返回orderoptions
    ytoOrderOptions:function (order,org) {
        
            var requestdata ={
                        OrderCode:order.ordercode,
                        ShipperCode:enumerableconstants.expCompany[org.type].code,//快递公司代码
                        CustomerName:org.account,//电子面单账号
                        // CustomerPwd:enumerableconstants.kdniao.customerpsd,//电子面单密码
                        MonthCode:org.accountpsd,
                        PayType:'1',
                        LogisticCode:'',
                        ExpType:'1',
                        Sender:{
                            Company:order.sendid.company,
                            Name:order.sendid.name,
                            Mobile:order.sendid.tele,
                            PostCode:order.sendid.postcode,
                            ProvinceName:order.sendid.provincename,
                            CityName:order.sendid.cityname,
                            ExpAreaName:order.sendid.expareaname,
                            Address:order.sendid.address
                        },
                        Receiver:{
                            Company:order.receiveid.company,
                            Name:order.receiveid.name,
                            Mobile:order.receiveid.tele,
                            PostCode:order.receiveid.postcode,
                            ProvinceName:order.receiveid.provincename,
                            CityName:order.receiveid.cityname,
                            ExpAreaName:order.receiveid.expareaname,
                            Address:order.receiveid.address
                        },
                        Commodity:[{
                            GoodsName:order.goodsname,
                            GoodsDesc:order.goodsdes
                        }],
                        IsReturnPrintTemplate:'1'
            }

            var ebusinessid =enumerableconstants.kdniao.businessid;
            var requestype = '1007';
            var requestdatautf8 = kdniao.requestData(JSON.stringify(requestdata));
            var datasign = kdniao.dataSign(JSON.stringify(requestdata),enumerableconstants.kdniao.apikey)
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
            console.log('测试orderoptions～～～～～～:'+JSON.stringify(orderoptions));

           return orderoptions;
               
          },
          
          
          
     //订阅快递路线
     bookorderoptions:function (org,LogisticCode) {
         
         var requestdata={
             ShipperCode:enumerableconstants.expCompany[org.type].code,//快递公司代码
             LogisticCode:LogisticCode
         }
         
         var ebusinessid =enumerableconstants.kdniao.businessid;
         var requestype = '1008';
         var requestdatautf8 = kdniao.requestData(JSON.stringify(requestdata));
         var datasign = kdniao.dataSign(JSON.stringify(requestdata),enumerableconstants.kdniao.apikey)
         var datatype = 2;//json格式

         var bookoptions={
                url:enumerableconstants.kdniao.bookorderurl,
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
            //console.log('测试orderoptions～～～～～～:'+JSON.stringify(orderoptions));

           return bookoptions;
         
         
     }
          
     
}
