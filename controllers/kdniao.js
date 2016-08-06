var  utils = require('utility');
var urlencode = require('urlencode');


module.exports={
    //加密datasign
    dataSign:function (data,apikey) {
        var str =data+apikey;
        return   urlencode(utils.base64encode(utils.md5(str)));
    },
    
    //将返回数据进行url编码
    requestData:function (data) {
        
        var data1 = urlencode(data);
        return data1;
    }
    
    
}