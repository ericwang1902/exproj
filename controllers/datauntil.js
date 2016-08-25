var async = require("async");
var moment = require("moment");

module.exports = {
    getweekDataUtil: function (org, weekdata, callback) {
        var today = moment().date();//今天的日期
        async.series([
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            "$gte": today.day(-1),
                            "$lt": today.day(0)
                        },
                        orgid: org
                    }, function (err, count) {
                        callback(null, count);

                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            "$gte": today.day(-2),
                            "$lt": today.day(-1)
                        },
                        orgid: org
                    }, function (err, count) {
                        callback(null, count);

                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            "$gte": today.day(-3),
                            "$lt": today.day(-2)
                        },
                        orgid: org
                    }, function (err, count) {
                        callback(null, count);

                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            "$gte": today.day(-4),
                            "$lt": today.day(-3)
                        },
                        orgid: org
                    }, function (err, count) {
                        callback(null, count);

                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            "$gte": today.day(-5),
                            "$lt": today.day(-4)
                        },
                        orgid: org
                    }, function (err, count) {
                        callback(null, count);

                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            "$gte": today.day(-6),
                            "$lt": today.day(-5)
                        },
                        orgid: org
                    }, function (err, count) {
                        callback(null, count);

                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            "$gte": today.day(-7),
                            "$lt": today.day(-6)
                        },
                        orgid: org
                    }, function (err, count) {
                        callback(null, count);

                    });
            },                                                         
        ], function (err, results) {
            callback(null,results);
        })

    }
}
