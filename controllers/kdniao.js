var utf8 = require('utf8');
var crypto = require('crypto');

module.exports={
    //加密datasign
    dataSign:function (data,apikey) {
        console.log(data);
        console.log(apikey);
        
        var hasher=crypto.createHash("md5");
        hasher.update(data+apikey);
        var hashmsg=hasher.digest('base64');//hashmsg为加密之后的数据
        var utf8msg = utf8.encode(hashmsg);
        console.log(hashmsg);
        console.log(utf8msg);
        return utf8msg;
    },
    
    //将返回数据utf8编码
    requestData:function (data) {
        var datauft8 = utf8.encode(data);

        
        return datauft8;
    }
    
    
}