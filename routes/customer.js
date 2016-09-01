var express = require('express');
var router = express.Router();
var wechatjs = require('../controllers/wechatapi');//调用wechatjs来设置
var request = require('request');
var enumerableconstants = require('../models/enumerableConstants')
var async = require('async');
var locationController = require('../controllers/locationController');
var fanModel = require('../models/fanModel');
var locationModel = require('../models/locationModel');
var sysuserModel = require('../models/sysuserModel');
var sysorderModel = require('../models/sysorderModel');
var uniqid = require('uniqid');
var sysorderController = require('../controllers/sysorderController');
var moment = require('moment')
var qs = require('querystring');

router.get('/order', function (req, res, next) {
    var openid = req.query.openid || req.session.openid;
    var orderid = req.query.orderid;


    try {
        //查找订单详情
        sysorderModel
            .findOne({ _id: orderid })
            .populate('sendid')
            .populate('receiveid')
            .populate('logisticdata')
            .exec(function (err, order) {
                if (err) console.log(err);

                console.log(order);

                res.render('./customer/order', {
                    layout: false,
                    order: order,
                    helpers: {
                        getstatusname: function (num) {

                            return enumerableconstants.orderstatus[num].name;
                        },
                        getorderdate: function (orderdate) {
                            moment.locale('zh-cn');
                            return moment(orderdate).format("LLL");
                        },
                        getlogisticorder: function (ordernum) {
                            if (ordernum == '')
                                return '尚未生成单号';
                            else
                                return ordernum;
                        }
                    }
                });
            })
    } catch (err) {
        res.redirect('/courier/resultinfo?result=-1&openid=' + openid);
    }



})

router.post('/createorder', function (req, res, next) {
    //创建sysorder，同时做通知默认快递点的几个快递员，根据fan的orgid，
    //去查找改orgid下面的快递员的openid，给这些openid发送模板消息。
    //当快递员点击进入模板消息，可以在网页内拨打用户电话，页面上有取件按钮。
    var openid = req.query.openid;
    var sendid = req.body.sendid;
    var recieveid = req.body.receiveid;
    var goodsname = req.body.goodsname;
    var goodsdes = req.body.goodsdes;

    try {
        async.waterfall([
            function (callback) {
                //查找到sendloc
                locationModel.findOne({ _id: sendid }, function (err, sendloc) {
                    if (err) console.log(err);

                    callback(null, sendloc);
                })
            },
            function (sendloc, callback) {
                //查找recieveloc
                locationModel.findOne({ _id: recieveid }, function (err, recieveloc) {
                    if (err) console.log(err);

                    callback(null, sendloc, recieveloc);
                })
            },
            function (sendloc, recieveloc, callback) {
                fanModel.findOne({ openid: openid }, function (err, fan) {
                    if (err) console.log(err);
                    console.log('fan:' + fan);

                    callback(null, sendloc, recieveloc, fan);
                })
            },
            function (sendloc, recieveloc, fan, callback) {
                //创建订单

                var sysorder = new sysorderModel({
                    fanopenid: openid,
                    ordercode: uniqid(),//订单号
                    goodsname: goodsname,
                    goodsdes: goodsdes,
                    receiveid: recieveloc._id,
                    sendid: sendloc._id,
                    orgid: fan.orgid,
                    status: enumerableconstants.orderstatus[0].num,
                    orderdate: moment(),
                    logisticorder: '',
                    template: '',
                    logisticdata: null,
                    pickdate: null
                })

                sysorder.save(function (err, sysorder) {
                    if (err) console.log(err);

                    callback(null, sysorder._id);
                })

            },
            function (sysorderid, callback) {
                //查找order全部信息
                sysorderModel
                    .findOne({ _id: sysorderid })
                    .populate('sendid')
                    .populate('receiveid')
                    .exec(function (err, order) {
                        if (err) console.log(err);
                        callback(null, order);
                    })

            }
        ], function (err, result) {
            //查找到sysorder.orgid的courierid对应的sysuser
            console.log('result orgid:' + result);
            sysuserModel.find({ orgid: result.orgid }, function (err, couriers) {
                if (err) console.log(err);


                //循环couriers，发送模板消息，根据courier的isbroadcast字段来发送
                for (i in couriers) {

                    // wechatjs.sendtext(couriers[i].openid,JSON.stringify(result));
                    wechatjs.sendTemplate1(
                        couriers[i].openid,
                        'http://exproj.robustudio.com/courier/orderhandle?openid=' + openid + '&orderid=' + result._id + '&courierid=' + couriers[i].openid,
                        result.goodsname,
                        result.sendid.name,
                        result.sendid.tele,
                        function (err, result) {
                            if (err) console.log(err);
                            console.log('result:' + JSON.stringify(result));
                        })
                }
                res.redirect('/courier/resultinfo?result=10&openid=' + openid);

            })
        })

    } catch (err) {

    }

})

router.get('/location', function (req, res, next) {
    var openid = req.query.openid;
    console.log('openid:' + req.query.openid);
    res.render('./customer/location', { layout: false, openid: openid });
})

router.post('/location', function (req, res, next) {

    //console.log(req.body);

    if (req.query.t == '0') {
        console.log("req.query.t=" + req.query.t);
        //新增地址
        async.waterfall([
            //获取地址所对应的粉丝,获取到userid
            function (callback) {
                fanModel.findOne({ openid: req.body.openid }, function (err, fan) {
                    if (err) console.log(err);

                    if (!fan) {
                        //创建粉丝数据
                        var fan = new fanModel({
                            openid: req.body.openid
                        })
                        fan.save(function (err, fan) {
                            if (err) console.log(err);

                            callback(null, fan);
                        })
                    } else {
                        //已经有粉丝了
                        callback(null, fan);
                    }
                })
            },
            //添加地址数据
            function (fan, callback) {
                // arg1 now equals 'one' and arg2 now equals 'two'
                if(req.body.name==''|| req.body.tele==''||req.body.address==''){
                    res.redirect('/courier/resultinfo?result=12&openid=' + req.body.openid);
                }
                var location = {
                    company: req.body.company,
                    name: req.body.name,
                    tele: req.body.tele,
                    postcode: req.body.postcode,
                    provincename: req.body.provincename,
                    cityname: req.body.cityname,
                    expareaname: req.body.expareaname,
                    address: req.body.address,
                    userid: fan._id,
                    type: req.body.type
                };
                var loc = new locationModel(location)

                loc.save(function (err, loc) {
                    if (err) {
                        console.log(err);
                        callback(null, 0);
                    }
                    else {
                        callback(null, 5);
                    }
                })
            }
        ], function (err, result) {
            // result now equals 'done'
            res.redirect('/courier/resultinfo?result=' + result + '&openid=' + req.body.openid);
        });
    }
    else if (req.query.t == '1') {
        //修改地址
        console.log(req.query.locid);
        locationModel.findOne({ _id: req.query.locid }, function (err, location) {
            if (err) console.log(err);
            console.log('location:' + location);

            location.company = req.body.company ? req.body.company : location.company;
            location.name = req.body.name ? req.body.name : location.name;
            location.tele = req.body.tele ? req.body.tele : location.tele;
            location.postcode = req.body.postcode ? req.body.postcode : location.postcode;
            location.provincename = req.body.provincename ? req.body.provincename : location.provincename;
            location.cityname = req.body.cityname ? req.body.cityname : location.cityname;
            location.expareaname = req.body.expareaname ? req.body.expareaname : location.expareaname;
            location.address = req.body.address ? req.body.address : location.address;

            location.save(function (err, loc) {
                if (err) console.log(err);
                console.log('loc:' + loc);
                res.redirect('/courier/resultinfo?result=6&openid=' + req.body.openid);
            })

        })
    }

})


router.get('/loclist', function (req, res, next) {
    //所有的入口都放在send里，从那里开始传递openid
    var openid = req.query.openid;


    //根据openid查找userid，根据userid查找收件地址列表
    async.waterfall([
        //获取地址所对应的粉丝,获取到userid
        function (callback) {
            fanModel.findOne({ openid: openid }, function (err, fan) {
                if (err) console.log(err);

                if (!fan) {
                    //创建粉丝数据
                    var fan = new fanModel({
                        openid: openid
                    })
                    fan.save(function (err, fan) {
                        if (err) console.log(err);

                        callback(null, fan);
                    })
                } else {
                    //已经有粉丝了
                    callback(null, fan);
                }
            })
        },
        //查找收件地址列表
        function (fan, callback) {
            locationModel.find({ userid: fan._id, type: 1 }, function (err, locs) {
                callback(null, locs);
            })
        }
    ], function (err, result) {
        // result now equals 'done'
        res.render('./customer/loclist', { layout: false, locs: result, openid: openid });
    });


})

router.get('/loclist2', function (req, res, next) {
    //所有的入口都放在send里，从那里开始传递openid
    var openid = req.query.openid;


    //根据openid查找userid，根据userid查找收件地址列表
    async.waterfall([
        //获取地址所对应的粉丝,获取到userid
        function (callback) {
            fanModel.findOne({ openid: openid }, function (err, fan) {
                if (err) console.log(err);

                if (!fan) {
                    //创建粉丝数据
                    var fan = new fanModel({
                        openid: openid
                    })
                    fan.save(function (err, fan) {
                        if (err) console.log(err);

                        callback(null, fan);
                    })
                } else {
                    //已经有粉丝了
                    callback(null, fan);
                }
            })
        },
        //查找收件地址列表
        function (fan, callback) {
            locationModel.find({ userid: fan._id, type: 2 }, function (err, locs) {
                callback(null, locs);
            })
        }
    ], function (err, result) {
        // result now equals 'done'
        res.render('./customer/loclist2', { layout: false, locs: result, openid: openid });
    });


})

router.get('/defaultsend', function (req, res, next) {
    var openid = req.query.openid || req.session.openid;//获取到当前用户的openid

    //根据openid查找userid，根据userid查找收件地址列表
    async.waterfall([
        //获取地址所对应的粉丝,获取到userid
        function (callback) {
            fanModel.findOne({ openid: openid }, function (err, fan) {
                if (err) console.log(err);

                if (!fan) {
                    //创建粉丝数据
                    var fan = new fanModel({
                        openid: openid
                    })
                    fan.save(function (err, fan) {
                        if (err) console.log(err);

                        callback(null, fan);
                    })
                } else {
                    //已经有粉丝了
                    console.log(fan);
                    callback(null, fan);
                }
            })
        },
        //查找寄件地址列表
        function (fan, callback) {
            locationModel.find({ userid: fan._id, type: 2 }, function (err, locs) {
                callback(null, locs);
            })
        }
    ], function (err, result) {
        // result now equals 'done'
        console.log(result);
        res.render('./customer/defaultsend', { layout: false, locs: result, openid: openid });
    });


})

router.post('/defaultsend', function (req, res, next) {
    var openid = req.query.openid || req.session.openid;//获取openid

    var defaultsendlocid = req.body.defaultsendradio;//获取表单提交来的locid

    //设置改openid的fan的defaultsend为defaultsendlocid   
    async.series([
        function (callback) {
            //查找defaultsend的id
            locationModel.findOne({ _id: defaultsendlocid }, function (err, loc) {
                if (err) console.log(err);
                console.log('defaultsendlocid:' + defaultsendlocid);
                console.log('defaultsend:' + loc);

                callback(null, loc);
            })

        },
        function (callback) {
            //根据openid查找到fan
            fanModel.findOne({ openid: openid }, function (err, fan) {
                if (err) console.log(err);

                callback(null, fan);
            })
        }

    ], function (err, results) {
        //修改fan的查找defaultsend的id
        try {
            var fan = results[1];
            fan.defaultsend = results[0]._id;

            fan.save(function (err, fan) {
                if (err) console.log(err);

                console.log('设置默认地址成功！');
                res.redirect('/courier/resultinfo?result=7&openid=' + openid);
            })
        } catch (err) {
            //尚未维护寄件地址
            res.redirect('/courier/resultinfo?result=9&openid=' + openid);
        }


    })


})

router.get('/defaultorg', function (req, res, next) {
    var openid = req.query.openid || req.session.openid;

    //查找系统里的代理点
    sysuserModel.find({ usertype: 2 }, function (err, orgs) {
        if (err) console.log(err);

        console.log(orgs);

        res.render('./customer/defaultorg', {
            openid:openid,
            layout: false,
            orgs: orgs,
            helpers: {
                getorgtype: function (type) {
                    return enumerableconstants.expCompany[type].name;
                }
            }
        })
    })
})

router.post('/defaultorg', function (req, res, next) {
    var openid = req.query.openid || req.session.openid;
    var defaultorgid = req.body.defaultorgradio;

    async.series([
        function (callback) {
            //查找到org的id
            sysuserModel.findOne({ _id: defaultorgid }, function (err, org) {
                if (err) console.log(err);

                callback(null, org);
            })

        },
        function (callback) {
            //查找到fan的doc
            fanModel.findOne({ openid: openid }, function (err, fan) {
                if (err) console.log(err);

                callback(null, fan);
            })
        }
    ], function (err, results) {
        var fan = results[1];
        var org = results[0];

        fan.orgid = org._id || fan.orgid;

        fan.save(function (err, fan) {
            if (err) console.log(err);

            console.log(fan);
            console.log('默认快递代理点设置成功');

            res.redirect('/courier/resultinfo?result=8&openid=' + openid);
        })

    })



})

//手机网页的入口，获取openid，创建用户
router.get('/send', getuserinfo, function (req, res, next) {
    var userinfo = req.userinfoJson;

    req.session.openid = req.query.openid || userinfo.openid;

    var openid = req.session.openid;

    console.log('send openid:' + userinfo.openid);

    async.series([
        function (callback) {
            //根据locid查找相应的location
            locationModel.findOne({ _id: req.session.recieveloc }, function (err, recieveloc) {
                if (err) console.log(err);
                callback(null, recieveloc);
            })

        },
        function (callback) {
            fanModel.findOne({ openid: openid }, function (err, fan) {
                if (err) console.log(err);

                if (!fan) {
                    //创建粉丝数据
                    var fan = new fanModel({
                        openid: openid
                    })
                    fan.save(function (err, fan) {
                        if (err) console.log(err);

                        callback(null, fan);
                    })
                } else {
                    //已经有粉丝了
                    callback(null, fan);
                }
            })

        },
        function (callback) {
            //获取粉丝信息，默认寄件地址
            fanModel
                .findOne({ openid: openid })
                .exec(function (err, fan) {
                    if (err) console.log(err);

                    try {
                        var sendloc = fan.defaultsend || req.session.sendloc;

                        locationModel.findOne({ _id: sendloc }, function (err, sendloc) {
                            if (err) console.log(err);
                            req.session.sendloc = sendloc;
                            callback(null, sendloc);

                        })
                    } catch (err) {
                        callback(null, '');
                    }
                })

        },
        function (callback) {
            //获取粉丝信息，设置默认受理点
            fanModel
                .findOne({ openid: openid })
                .populate("orgid")//获取默认受理点
                .exec(function (err, fan) {
                    if (err) console.log(err);
                    console.log(fan)
                    var defaultorg=''
                    if(fan.orgid){
                      defaultorg = fan.orgid.title;//获取默认寄件点
                    }else{
                      defaultorg ='尚未设置';
                    }

                    callback(null, defaultorg);
                })
        }
    ],
        // optional callback
        function (err, results) {
            if (err) console.log(err);
            console.log('result[2]:' + results[2]);
            res.render('./customer/send',
                {
                    layout: false,
                    openid: openid,
                    recieveloc: results[0],
                    sendloc: results[2],
                    fan: results[1],
                    defaultorg: results[3]
                });
        });
})

router.post('/send', function (req, res, next) {
    //获取openid
    var openid = req.query.openid;
    if (req.query.type == 1) {
        var recievelocid = req.body.radio1;
        req.session.recieveloc = recievelocid;
    } else if (req.query.type == 2) {
        var sendlocid = req.body.radio2;
        req.session.sendloc = sendlocid;
    }
    console.log(req.body);//radio1:locid

    async.series([
        function (callback) {
            //根据locid查找相应的location
            locationModel.findOne({ _id: req.session.recieveloc }, function (err, recieveloc) {
                if (err) console.log(err);
                callback(null, recieveloc);
            })

        },
        function (callback) {
            // do some more stuff ...
            locationModel.findOne({ _id: req.session.sendloc }, function (err, sendloc) {
                if (err) console.log(err);
                callback(null, sendloc);
            })
        },
        function(callback){
           //获取粉丝信息，设置默认受理点
            fanModel
                .findOne({ openid: openid })
                .populate("orgid")//获取默认受理点
                .exec(function (err, fan) {
                    if (err) console.log(err);
                    console.log(fan)
                    var defaultorg=''
                    if(fan.orgid){
                      defaultorg = fan.orgid.title;//获取默认寄件点
                    }else{
                      defaultorg ='尚未设置';
                    }

                    callback(null, defaultorg);
                })
        }
    ],
        // optional callback
        function (err, results) {
            if (err) console.log(err);
            res.render('./customer/send',
                {
                    layout: false,
                    openid: openid,
                    recieveloc: results[0],
                    sendloc: results[1],
                    defaultorg:results[2]
                });
        });

})

router.get('/sendrecord', function (req, res, next) {
    var openid = req.query.openid;

    try {
        //根据openid查找orderlist
        sysorderModel
            .find({ fanopenid: openid })
            .populate('sendid')
            .populate('receiveid')
            .exec(function (err, orders) {
                if (err) console.log(err);

                console.log(orders);
                res.render('./customer/sendrecord', { layout: false, openid: openid, orders: orders });
            })
    } catch (err) {
        res.redirect('/courier/resultinfo?result=-1&openid=' + openid);

    }

})
router.get('/sendrecordapi', function (req, res, next) {
    var openid = req.session.openid || req.query.openid;

    sysorderController.listapi(openid, req, res);
})

router.get('/locnav', function (req, res, next) {
    var openid = req.query.openid || req.session.openid

    res.render('./customer/locnav', { layout: false, openid: openid });
})

router.get('/locdetail', function (req, res, next) {
    var userid = req.query.userid;
    var locid = req.query.locid;//获取相应的locid
    console.log("locid:" + locid);
    var openid = req.session.openid;

    async.series([
        function (callback) {
            //根据locid查找相应的location
            locationModel.findOne({ _id: locid }, function (err, loc) {
                if (err) console.log(err);
                callback(null, loc);
            })

        },
        function (callback) {
            // do some more stuff ...
            fanModel.findOne({ _id: userid }, function (err, user) {
                if (err) console.log(err);
                callback(err, user);
            })
        }
    ],
        // optional callback
        function (err, results) {
            // results is now equal to ['one', 'two']
            res.render('./customer/locdetail', {
                layout: false,
                openid: openid,//results[1].openid
                location: results[0],
                locid: locid,
                helpers: {
                    gettype: function (type) {
                        if (type == '1')
                            return '收件地址';
                        if (type == '2')
                            return '寄件地址';
                    }
                }
            })
        });
})


router.get('/recievelist', function (req, res, next) {
    // var openid = req.query.openid;
    var openid = req.session.openid;
    //根据openid查找userid，根据userid查找收件地址列表
    async.waterfall([
        //获取地址所对应的粉丝,获取到userid
        function (callback) {
            fanModel.findOne({ openid: openid }, function (err, fan) {
                if (err) console.log(err);

                if (!fan) {
                    //创建粉丝数据
                    var fan = new fanModel({
                        openid: openid
                    })
                    fan.save(function (err, fan) {
                        if (err) console.log(err);

                        callback(null, fan);
                    })
                } else {
                    //已经有粉丝了
                    console.log(fan);
                    callback(null, fan);
                }
            })
        },
        //查找收件地址列表
        function (fan, callback) {
            locationModel.find({ userid: fan._id, type: 1 }, function (err, locs) {
                callback(null, locs);
            })
        }
    ], function (err, result) {
        // result now equals 'done'
        console.log(result);
        res.render('./customer/recievelist', { layout: false, locs: result, openid: openid });
    });
})

router.get('/sendlist', function (req, res, next) {
    // var openid = req.query.openid;
    var openid = req.session.openid;
    //根据openid查找userid，根据userid查找收件地址列表
    async.waterfall([
        //获取地址所对应的粉丝,获取到userid
        function (callback) {
            fanModel.findOne({ openid: openid }, function (err, fan) {
                if (err) console.log(err);

                if (!fan) {
                    //创建粉丝数据
                    var fan = new fanModel({
                        openid: openid
                    })
                    fan.save(function (err, fan) {
                        if (err) console.log(err);

                        callback(null, fan);
                    })
                } else {
                    //已经有粉丝了
                    console.log(fan);
                    callback(null, fan);
                }
            })
        },
        //查找寄件地址列表
        function (fan, callback) {
            locationModel.find({ userid: fan._id, type: 2 }, function (err, locs) {
                callback(null, locs);
            })
        }
    ], function (err, result) {
        // result now equals 'done'
        console.log(result);
        res.render('./customer/sendlist', { layout: false, locs: result, openid: openid });
    });
})


router.get('/setting', function (req, res, next) {
    // var openid = req.query.openid;
    var openid = req.session.openid || req.query.openid;

    async.waterfall([
        function (callback) {
            //查找用户数据
            fanModel.findOne({ openid: openid }, function (err, fan) {
                if (err) console.log(err);

                callback(null, fan);
            })
        },
        function (fan, callback) {
            //查找默认寄件地址信息    
            locationModel.findOne({ _id: fan.defaultsend }, function (err, loc) {
                if (err) console.log(err);

                callback(null, fan, loc)
            })
        },
        function (fan, loc, callback) {
            //查找fan的默认快递点的信息
            sysuserModel.findOne({ _id: fan.orgid }, function (err, sysuser) {
                if (err) console.log(err);

                var result = {
                    sysuser: sysuser,
                    loc: loc
                }

                callback(null, result);
            })
        }
    ], function (err, result) {
        if (err) console.log(err);

        res.render('./customer/setting', {
            layout: false,
            openid: openid,
            defaultsend: result.loc,
            defaultorg: result.sysuser,
            helpers: {
                getorgtype: function (type) {
                    if (type == '' || type == null)
                        return '';
                    else
                        return enumerableconstants.expCompany[type].name;
                }
            }
        });
    })
})



//通过用户授权，获取微信jstoken和用户信息
function getuserinfo(req, res, next) {

    //添加判断openid是否存在该属性
    console.log("req.query:"+req.query.openid)
    
    if (req.query.openid!= '') {
        var queryurl = req.query;
        var queryobj = qs.parse(queryurl);
        var querydata = Object.create(queryobj)

        if (Object.prototype.hasOwnProperty.call(querydata, 'openid')) {
            //有值
            var userinfoJson = {
                openid: req.query.openid
            }
            req.userinfoJson = userinfoJson;
            req.session.openid = userinfoJson.openid;
            return next();
        } else {
            //没
            //console.log('code:' + req.query.code);//获取微信重定向之后，生成的code 
            async.waterfall([
                //获取accesstoken
                function (callback) {
                    var accesstokenoptions = {
                        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + enumerableconstants.wechatinfo.appid + '&secret=' + enumerableconstants.wechatinfo.appsecret + '&code=' + req.query.code + '&grant_type=authorization_code'
                    }
                    request(accesstokenoptions, function (error, response, body) {
                        var bodyJson = JSON.parse(body);//转成json对象 
                        var access_token = bodyJson.access_token;
                        var refresh_token = bodyJson.refresh_token;
                        var openid = bodyJson.openid;
                        req.session.openid = openid;
                        console.log('access_token:' + access_token);
                        console.log('refresh_token:' + refresh_token);
                        console.log('openid:' + openid);
                        callback(null, access_token, refresh_token, openid);
                    })
                },
                //获取用户信息
                function (access_token, refresh_token, openid, callback) {
                    console.log('access_token:' + access_token);
                    console.log('refresh_token:' + refresh_token);
                    console.log('openid:' + openid);
                    //  wechatjs.sendtext(openid,'hello');//客服消息，互动48小时内有效
                    var userinfooptions = {
                        url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN'
                    }


                    if (openid) {
                        fanModel.findOne({ openid: openid }, function (err, fan) {
                            if (err) console.log(err);

                            if (!fan) {
                                //创建粉丝数据
                                var fan = new fanModel({
                                    openid: openid,
                                    orgid: null,
                                    sendlist: null,
                                    receivelist: null,
                                    defaultsend: null
                                })
                                fan.save(function (err, fan) {
                                    if (err) console.log(err);

                                    //这个body就是用户信息
                                    request(userinfooptions, function (error, response, body) {
                                        callback(null, body);
                                    })
                                })
                            } else {
                                //已经有粉丝了
                                console.log(fan);
                                //这个body就是用户信息
                                request(userinfooptions, function (error, response, body) {
                                    callback(null, body);
                                })
                            }
                        })
                    } else {
                        callback(null, null);
                    }

                }
            ], function (err, result) {
                // result now equals 'done'
                console.log(result);

                if (result) {
                    var userinfoJson = JSON.parse(result);
                    req.userinfoJson = userinfoJson;
                    return next();
                } else {
                    getuserinfo();
                }
            });
        }
    } else {
        //没
        //console.log('code:' + req.query.code);//获取微信重定向之后，生成的code 
        async.waterfall([
            //获取accesstoken
            function (callback) {
                var accesstokenoptions = {
                    url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + enumerableconstants.wechatinfo.appid + '&secret=' + enumerableconstants.wechatinfo.appsecret + '&code=' + req.query.code + '&grant_type=authorization_code'
                }
                request(accesstokenoptions, function (error, response, body) {
                    var bodyJson = JSON.parse(body);//转成json对象 
                    var access_token = bodyJson.access_token;
                    var refresh_token = bodyJson.refresh_token;
                    var openid = bodyJson.openid;
                    req.session.openid = openid;
                    console.log('access_token:' + access_token);
                    console.log('refresh_token:' + refresh_token);
                    console.log('openid:' + openid);
                    callback(null, access_token, refresh_token, openid);
                })
            },
            //获取用户信息
            function (access_token, refresh_token, openid, callback) {
                console.log('access_token:' + access_token);
                console.log('refresh_token:' + refresh_token);
                console.log('openid:' + openid);
                //  wechatjs.sendtext(openid,'hello');//客服消息，互动48小时内有效
                var userinfooptions = {
                    url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN'
                }


                if (openid) {
                    fanModel.findOne({ openid: openid }, function (err, fan) {
                        if (err) console.log(err);

                        if (!fan) {
                            //创建粉丝数据
                            var fan = new fanModel({
                                openid: openid,
                                orgid: null,
                                sendlist: null,
                                receivelist: null,
                                defaultsend: null
                            })
                            fan.save(function (err, fan) {
                                if (err) console.log(err);

                                //这个body就是用户信息
                                request(userinfooptions, function (error, response, body) {
                                    callback(null, body);
                                })
                            })
                        } else {
                            //已经有粉丝了
                            console.log(fan);
                            //这个body就是用户信息
                            request(userinfooptions, function (error, response, body) {
                                callback(null, body);
                            })
                        }
                    })
                } else {
                    callback(null, null);
                }

            }
        ], function (err, result) {
            // result now equals 'done'
            console.log(result);

            if (result) {
                var userinfoJson = JSON.parse(result);
                req.userinfoJson = userinfoJson;
                return next();
            } else {
                getuserinfo();
            }
        });
    }
}


module.exports = router;