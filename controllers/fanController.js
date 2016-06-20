var fanModel = require('../models/fanModel.js');

/**
 * fanController.js
 *
 * @description :: Server-side logic for managing fans.
 */
module.exports = {

    /**
     * fanController.list()
     */
    list: function(req, res) {
        fanModel.find(function(err, fans){
            if(err) {
                return res.json(500, {
                    message: 'Error getting fan.'
                });
            }
            return res.json(fans);
        });
    },

    /**
     * fanController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        fanModel.findOne({_id: id}, function(err, fan){
            if(err) {
                return res.json(500, {
                    message: 'Error getting fan.'
                });
            }
            if(!fan) {
                return res.json(404, {
                    message: 'No such fan'
                });
            }
            return res.json(fan);
        });
    },

    /**
     * fanController.create()
     */
    create: function(req, res) {
        var fan = new fanModel({			openid : req.body.openid,			orgid : req.body.orgid,			sendlist : req.body.sendlist,			receivelist : req.body.receivelist
        });

        fan.save(function(err, fan){
            if(err) {
                return res.json(500, {
                    message: 'Error saving fan',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: fan._id
            });
        });
    },

    /**
     * fanController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        fanModel.findOne({_id: id}, function(err, fan){
            if(err) {
                return res.json(500, {
                    message: 'Error saving fan',
                    error: err
                });
            }
            if(!fan) {
                return res.json(404, {
                    message: 'No such fan'
                });
            }

            fan.openid =  req.body.openid ? req.body.openid : fan.openid;			fan.orgid =  req.body.orgid ? req.body.orgid : fan.orgid;			fan.sendlist =  req.body.sendlist ? req.body.sendlist : fan.sendlist;			fan.receivelist =  req.body.receivelist ? req.body.receivelist : fan.receivelist;			
            fan.save(function(err, fan){
                if(err) {
                    return res.json(500, {
                        message: 'Error getting fan.'
                    });
                }
                if(!fan) {
                    return res.json(404, {
                        message: 'No such fan'
                    });
                }
                return res.json(fan);
            });
        });
    },

    /**
     * fanController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        fanModel.findByIdAndRemove(id, function(err, fan){
            if(err) {
                return res.json(500, {
                    message: 'Error getting fan.'
                });
            }
            return res.json(fan);
        });
    }
};