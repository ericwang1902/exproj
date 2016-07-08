var  utils = require('utility');
var utf8 = require('utf8')

module.exports={
    //加密datasign
    dataSign:function (data,apikey) {
        var str =data+apikey;
        
        console.log('md5:'+utils.md5(str));
        console.log('base64:'+utils.base64encode(utils.md5(str)));
        console.log('utf8:'+utf8.encode(utils.base64encode(utils.md5(str))));
        
        return  utf8.encode(utils.base64encode(utils.md5(str)));
    },
    
    //将返回数据utf8编码
    requestData:function (data) {
        var datauft8 = utf8.encode(data);
        
        return datauft8;
    }
    
    
}