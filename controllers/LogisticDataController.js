var LogisticDataModel = require('../models/LogisticDataModel.js');

/**
 * LogisticDataController.js
 *
 * @description :: Server-side logic for managing LogisticDatas.
 */
module.exports = {

    /**
     * LogisticDataController.list()
     */
    list: function(req, res) {
        LogisticDataModel.find(function(err, LogisticDatas){
            if(err) {
                return res.json(500, {
                    message: 'Error getting LogisticData.'
                });
            }
            return res.json(LogisticDatas);
        });
    },

    /**
     * LogisticDataController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        LogisticDataModel.findOne({_id: id}, function(err, LogisticData){
            if(err) {
                return res.json(500, {
                    message: 'Error getting LogisticData.'
                });
            }
            if(!LogisticData) {
                return res.json(404, {
                    message: 'No such LogisticData'
                });
            }
            return res.json(LogisticData);
        });
    },

    /**
     * LogisticDataController.create()
     */
    create: function(req, res) {
        var LogisticData = new LogisticDataModel({			EBusinessID : req.body.EBusinessID,			OrderCode : req.body.OrderCode,			ShipperCode : req.body.ShipperCode,			LogisticCode : req.body.LogisticCode,			Success : req.body.Success,			Reason : req.body.Reason,			State : req.body.State,			CallBack : req.body.CallBack,			Traces : req.body.Traces
        });

        LogisticData.save(function(err, LogisticData){
            if(err) {
                return res.json(500, {
                    message: 'Error saving LogisticData',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: LogisticData._id
            });
        });
    },

    /**
     * LogisticDataController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        LogisticDataModel.findOne({_id: id}, function(err, LogisticData){
            if(err) {
                return res.json(500, {
                    message: 'Error saving LogisticData',
                    error: err
                });
            }
            if(!LogisticData) {
                return res.json(404, {
                    message: 'No such LogisticData'
                });
            }

            LogisticData.EBusinessID =  req.body.EBusinessID ? req.body.EBusinessID : LogisticData.EBusinessID;			LogisticData.OrderCode =  req.body.OrderCode ? req.body.OrderCode : LogisticData.OrderCode;			LogisticData.ShipperCode =  req.body.ShipperCode ? req.body.ShipperCode : LogisticData.ShipperCode;			LogisticData.LogisticCode =  req.body.LogisticCode ? req.body.LogisticCode : LogisticData.LogisticCode;			LogisticData.Success =  req.body.Success ? req.body.Success : LogisticData.Success;			LogisticData.Reason =  req.body.Reason ? req.body.Reason : LogisticData.Reason;			LogisticData.State =  req.body.State ? req.body.State : LogisticData.State;			LogisticData.CallBack =  req.body.CallBack ? req.body.CallBack : LogisticData.CallBack;			LogisticData.Traces =  req.body.Traces ? req.body.Traces : LogisticData.Traces;			
            LogisticData.save(function(err, LogisticData){
                if(err) {
                    return res.json(500, {
                        message: 'Error getting LogisticData.'
                    });
                }
                if(!LogisticData) {
                    return res.json(404, {
                        message: 'No such LogisticData'
                    });
                }
                return res.json(LogisticData);
            });
        });
    },

    /**
     * LogisticDataController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        LogisticDataModel.findByIdAndRemove(id, function(err, LogisticData){
            if(err) {
                return res.json(500, {
                    message: 'Error getting LogisticData.'
                });
            }
            return res.json(LogisticData);
        });
    }
};