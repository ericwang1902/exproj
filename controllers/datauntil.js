var async = require("async");
var moment = require("moment");

module.exports = {
    getweekDataUtil: function (org, weekdata, dayrange,index, callback) {
        var today = moment().date();//今天的日期

        var condition = {
            orderdate: {
                "$gte": today.day(-index-1),
                "$lt": today.day(-index)
            },
            orgid:org
        }

        //计算count
        sysorderModel.count(condition, function (err, count) {
            weekdata[index] = count;
            index = index + 1;
            console.log(index)

            this.getweekDataUtil(org, weekdata, dayrange,index, callback)

           
            callback(null, weekdata,index);
            
        });
    }
}
