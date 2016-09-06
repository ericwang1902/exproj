var sysorderModel = require('../models/sysorderModel.js');
var async = require("async");
var moment = require("moment");
/**
 * sysorderController.js
 *
 * @description :: Server-side logic for managing sysorders.
 */
module.exports = {

    /**
     * sysorderController.list()
     */
    list: function (page, condition, callback2) {
        var pageItems = 10;

        async.series([
            function (callback) {
                sysorderModel.count(condition, function (err, count) {
                    if (err) console.log(err);
                    callback(null, count);
                })
            },
            function (callback) {
                sysorderModel
                    .find(condition)
                    .sort([['orderdate', -1]])
                    .populate('sendid')
                    .populate('receiveid')
                    .populate('courierid')
                    .populate('orgid')
                    .skip((page - 1) * pageItems)
                    .limit(pageItems)
                    .exec(function (err, orders) {
                        if (err) console.log(err);

                        callback(null, orders);
                    })
            }

        ], function (err, results) {
            callback2(null, results[0], results[1]);
        })
    },

    //easyui获取org的订单的接口
    bilist:function (page,pageItems,condition, callback2) {

        async.series([
            function (callback) {
                sysorderModel
                    .find(condition)
                    .sort([['orderdate', -1]])
                    .populate('sendid')
                    .populate('receiveid')
                    .populate('courierid')
                    .populate('orgid')
                    .skip((page - 1) * pageItems)
                    .limit(pageItems)
                    .exec(function (err, orders) {
                        if (err) console.log(err);

                        callback(null, orders);
                    })
            }

        ], function (err, results) {
            callback2(null, results[0]);
        })
    },

    listapi: function (openid, req, res) {
        sysorderModel
            .find({ fanopenid: openid })
            .sort([['orderdate', -1]])
            .populate('sendid')
            .populate('receiveid')
            .exec(function (err, orders) {
                if (err) {
                    return res.json(500, {
                        message: 'Error getting sysorder.'
                    });
                }
                return res.json(orders);
            })


    },


    /**
     * sysorderController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        sysorderModel.findOne({ _id: id }, function (err, sysorder) {
            if (err) {
                return res.json(500, {
                    message: 'Error getting sysorder.'
                });
            }
            if (!sysorder) {
                return res.json(404, {
                    message: 'No such sysorder'
                });
            }
            return res.json(sysorder);
        });
    },

    showdetail: function (orderid, callback) {
        sysorderModel
            .findOne({ _id: orderid })
            .populate('receiveid')
            .populate('courierid')
            .populate('orgid')
            .exec(function (err, sysorder) {
                if (err) console.log(err);

                callback(null, sysorder);
            })
    },

    /**
     * sysorderController.create()
     */
    create: function (req, res) {
        var sysorder = new sysorderModel({
            status: req.body.status,
            logisticorder: req.body.logisticorder,
            courierid: req.body.courierid,
            orgid: req.body.orgid,
            logs: req.body.logs,
            customername: req.body.customername,
            customerpwd: req.body.customerpwd,
            sendsite: req.body.sendsite,
            shippercode: req.body.shippercode,
            ordercode: req.body.ordercode,
            paytype: req.body.paytype,
            exptype: req.body.exptype,
            receiveid: req.body.receiveid,
            sendid: req.body.sendid,
            goodsname: req.body.goodsname,
            isreturnprinttemplate: req.body.isreturnprinttemplate,
            ebusinessid: req.body.ebusinessid,
            requesttype: req.body.requesttype,
            datasign: req.body.datasign,
            datatype: req.body.datatype
        });

        sysorder.save(function (err, sysorder) {
            if (err) {
                return res.json(500, {
                    message: 'Error saving sysorder',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: sysorder._id
            });
        });
    },

    /**
     * sysorderController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        sysorderModel.findOne({ _id: id }, function (err, sysorder) {
            if (err) {
                return res.json(500, {
                    message: 'Error saving sysorder',
                    error: err
                });
            }
            if (!sysorder) {
                return res.json(404, {
                    message: 'No such sysorder'
                });
            }

            sysorder.status = req.body.status ? req.body.status : sysorder.status;
            sysorder.logisticorder = req.body.logisticorder ? req.body.logisticorder : sysorder.logisticorder;
            sysorder.courierid = req.body.courierid ? req.body.courierid : sysorder.courierid;
            sysorder.orgid = req.body.orgid ? req.body.orgid : sysorder.orgid;
            sysorder.logs = req.body.logs ? req.body.logs : sysorder.logs;
            sysorder.customername = req.body.customername ? req.body.customername : sysorder.customername;
            sysorder.customerpwd = req.body.customerpwd ? req.body.customerpwd : sysorder.customerpwd;
            sysorder.sendsite = req.body.sendsite ? req.body.sendsite : sysorder.sendsite;
            sysorder.shippercode = req.body.shippercode ? req.body.shippercode : sysorder.shippercode;
            sysorder.ordercode = req.body.ordercode ? req.body.ordercode : sysorder.ordercode;
            sysorder.paytype = req.body.paytype ? req.body.paytype : sysorder.paytype;
            sysorder.exptype = req.body.exptype ? req.body.exptype : sysorder.exptype;
            sysorder.receiveid = req.body.receiveid ? req.body.receiveid : sysorder.receiveid;
            sysorder.sendid = req.body.sendid ? req.body.sendid : sysorder.sendid;
            sysorder.goodsname = req.body.goodsname ? req.body.goodsname : sysorder.goodsname;
            sysorder.isreturnprinttemplate = req.body.isreturnprinttemplate ? req.body.isreturnprinttemplate : sysorder.isreturnprinttemplate;
            sysorder.ebusinessid = req.body.ebusinessid ? req.body.ebusinessid : sysorder.ebusinessid;
            sysorder.requesttype = req.body.requesttype ? req.body.requesttype : sysorder.requesttype;
            sysorder.datasign = req.body.datasign ? req.body.datasign : sysorder.datasign;
            sysorder.datatype = req.body.datatype ? req.body.datatype : sysorder.datatype;

            sysorder.save(function (err, sysorder) {
                if (err) {
                    return res.json(500, {
                        message: 'Error getting sysorder.'
                    });
                }
                if (!sysorder) {
                    return res.json(404, {
                        message: 'No such sysorder'
                    });
                }
                return res.json(sysorder);
            });
        });
    },

    /**
     * sysorderController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        sysorderModel.findByIdAndRemove(id, function (err, sysorder) {
            if (err) {
                return res.json(500, {
                    message: 'Error getting sysorder.'
                });
            }
            return res.json(sysorder);
        });
    },
    //统计一周的订单数据
    getweekData: function (userid, callback1) {
        //  console.log("today:"+today.add(1, 'days').format('LLL'))
        async.series([
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(-6, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(-5, 'days')
                        },
                        orgid: userid
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(-5, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(-4, 'days')
                        },
                        orgid: userid
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(-4, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(-3, 'days')
                        },
                        orgid: userid
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(-3, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(-2, 'days')
                        },
                        orgid: userid
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(-2, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(-1, 'days')
                        },
                        orgid: userid
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(-1, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(0, 'days')
                        },
                        orgid: userid
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(0, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(1, 'days')
                        },
                        orgid: userid
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            }
        ], function (err, results) {

            if (err) {
                console.log(err)
            } else {
                callback1(null, results)
            }

        })



    },
    //获取系统全部的一周数据
    gettotalTodayOrderCount: function (callback1) {
        async.series([
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(-6, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(-5, 'days')
                        }
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(-5, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(-4, 'days')
                        }
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(-4, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(-3, 'days')
                        }
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(-3, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(-2, 'days')
                        }
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(-2, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(-1, 'days')
                        }
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(-1, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(0, 'days')
                        }
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            },
            function (callback) {
                sysorderModel.count(
                    {
                        orderdate: {
                            $gte: moment().second(0).minute(0).hour(0).add(0, 'days'),
                            $lt: moment().second(0).minute(0).hour(0).add(1, 'days')
                        }
                    }, function (err, count1) {
                        callback(null, count1);
                    });
            }
        ], function (err, results) {

            if (err) {
                console.log(err)
            } else {
                callback1(null, results)
            }

        })
    }


};