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
        var LogisticData = new LogisticDataModel({
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

            LogisticData.EBusinessID =  req.body.EBusinessID ? req.body.EBusinessID : LogisticData.EBusinessID;
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