var express = require('express');
var router = express.Router();
var sysuserController = require('../controllers/sysuserController');
var sysorderController = require('../controllers/sysorderController');
var enumerableConstants = require('../models/enumerableConstants');
var sysuserModel = require('../models/sysuserModel');
var sysorderModel = require('../models/sysorderModel');
var async = require('async');
var moment = require('moment')
/* GET users listing. */
router.get('/orgdash',isLogedIn, function (req, res, next) {
    moment.locale('zh-cn')
    //获取上统计数据，CLuserid是currentLoginuserId
    var userid = req.session.CLuserid

    var dateArray = []

    for (var index =6; index >=0; index--) {
        dateArray.push(
            (moment().add(-index,'days').format('M月D号'))
            )
    }

    sysorderController.getweekData(userid, function (err, result) {
        console.log(JSON.stringify(result));
        res.render('./org/orgdash', { id: req.session.CLuserid, weekdata: result, datearray: dateArray});
    })




});

router.get('/orguserlist',isLogedIn, function (req, res, next) {
    var id = req.session.CLuserid;
    var p = req.query.p;//当前页号
    //查找该org下的所有的快递员

    sysuserController.orglist(p, { orgid: id }, function (err, count, users1) {
        var TotalPage = Math.ceil(count / 10);

        var pagesArray = [];

        for (var i = 1; i <= TotalPage; i++) {
            pagesArray.push({ p: i });
        }

        res.render('./org/orguserlist', {
            id: id,
            users: users1,
            pagesArray: pagesArray
        });
    })

})

router.get('/orguserdetail',isLogedIn, function (req, res, next) {
    var id = req.query.id;//快递员id

    //根据快递员id查找到他所归属的快递点，读取快递点的信息。
    async.waterfall([
        function (callback) {
            sysuserController.orguserdetail(id, function (err, user) {
                if (err) console.log(err);
                callback(null, user);
            })
        },
        function (arg1, callback) {
            // arg1 now equals 'one' and arg2 now equals 'two'
            sysuserController.orguserdetail(arg1.orgid, function (err, orginfo) {
                if (err) console.log(err);
                callback(null, arg1, orginfo);
            })
        }
    ], function (err, userinfo, orginfo) {
        // result now equals 'done'
        console.log('userinfo:' + userinfo);
        console.log('orginfo:' + orginfo);
        if (err) console.log(err);

        //  res.send(user);
        res.render('./org/orgdetail', {
            user: userinfo,
            orginfo: orginfo,//所属快递点的相关信息
            helpers: {
                getUsertype: function (usertype) {
                    var typename = '';
                    switch (usertype) {
                        case '1': typename = '系统管理员'; break;
                        case '2': typename = '快递点'; break;
                        case '3': typename = '快递员'; break;
                        default: break;
                    }
                    return typename;
                },
                getCompany: function (user) {
                    if (user.usertype != '1' && user.type != '' && user.type != null) {
                        return enumerableConstants.expCompany[user.type ].name;
                    }
                    else
                        return '';
                }
            }
        });

    });


})

router.get('/orgusermodify',isLogedIn, function (req, res, next) {
    var id = req.query.id;

    sysuserModel.findOne({ _id: id }, function (err, user) {
        if (err) console.log(err);


        res.render('./org/orgusermodify', {
            user: user,
            userstatus: enumerableConstants.userstatus,
            helpers: {
                getUsertype: function (usertype) {
                    var usertypename = '';
                    switch (usertype) {
                        case '1':
                            usertypename = '系统管理员';
                            break;
                        case '2':
                            usertypename = '快递点';
                            break;
                        case '3':
                            usertypename = '快递员';
                            break;
                        default:
                            usertypename = '';
                            break;
                    }
                    return usertypename;
                },
                userstatushelper: function (statusnum) {
                    return enumerableConstants.userstatus[statusnum - 1].status;
                },
                broadcast: function (isbroadcast) {
                    if (isbroadcast == '' || isbroadcast == null) {
                        return '';
                    } else if (isbroadcast == user.isbroadcast) {
                        return 'checked';
                    } else {
                        return '';
                    }
                }
            }
        });
    })
})

router.post('/orgusermodify', function (req, res, next) {
    var id = req.query.id;

    sysuserController.update(req, res, function (err, result) {
        console.log(result);
        if (err) {
            req.flash('error_msg', err.error)
            res.redirect('/org/usermodify?id=' + id);
        } else {
            req.flash('sucess_msg', '修改成功！')
            res.redirect('/org/orguserdetail?id=' + id);
        }

    })


})

router.get('/orderlist',isLogedIn, function (req, res, next) {
    var id = req.session.CLuserid;//这是组织的id
    var currentPage = req.query.p;


    //根据快递员id，来获取该快递员取件的快递列表
    sysorderController.list(currentPage, { orgid: id }, function (err, count, orders) {
        var Totalpages = Math.ceil(count / 10);

        var pagesArray = [];
        for (var i = 1; i <= Totalpages; i++) {
            pagesArray.push({ p: i, orgid: id });
        }
        //  console.log('订单列表：'+JSON.stringify(orders));

        res.render('./contents/orderlist', {
            orders: orders,
            pagesArray: pagesArray,
            helpers: {
                getorderdate: function (orderdate) {
                    moment.locale('zh-cn');
                    return moment(orderdate).format("LLL");
                }
            }
        })
    })

})

router.get('/orderdetail',isLogedIn, function (req, res, next) {
    var orderid = req.query.orderid;//订单id

    //查询快递单详情
    sysorderController.showdetail(orderid, function (err, sysorder) {
        console.log('快递单详情：' + JSON.stringify(sysorder.template));
        sysorder.template=sysorder.template.replace(/simsun/g, 'Microsoft YaHei')//将样式里的宋体改成雅黑，雅黑可以在打印机打印加粗
        sysorder.template=sysorder.template.replace(/height="40"/g, 'height="61.5"')//将条码拉长
        sysorder.template=sysorder.template.replace(/solid #000 1px/g, 'none')//将边框去掉
        //下面两个是将寄件人调小
        sysorder.template=sysorder.template.replace(/.no_border{ width:100%; height:100%; font-size:14px;}/g, '.no_border{ width:100%; height:100%; font-size:14px;}.send_css{font-size:12px}')
        sysorder.template=sysorder.template.replace(/<table class="no_border">/g, '<table class="send_css">')
        res.render('./contents/orderdetail', {
            sysorder: sysorder
        })
    })
})

//做路由登陆验证
function isLogedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('error_msg','您尚未登陆！');
    res.redirect("/login");
  }
  
}


module.exports = router;
