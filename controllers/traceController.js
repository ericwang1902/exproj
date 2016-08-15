var traceModel = require('../models/traceModel.js');

/**
 * traceController.js
 *
 * @description :: Server-side logic for managing traces.
 */
module.exports = {

    /**
     * traceController.list()
     */
    list: function(req, res) {
        traceModel.find(function(err, traces){
            if(err) {
                return res.json(500, {
                    message: 'Error getting trace.'
                });
            }
            return res.json(traces);
        });
    },

    /**
     * traceController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        traceModel.findOne({_id: id}, function(err, trace){
            if(err) {
                return res.json(500, {
                    message: 'Error getting trace.'
                });
            }
            if(!trace) {
                return res.json(404, {
                    message: 'No such trace'
                });
            }
            return res.json(trace);
        });
    },

    /**
     * traceController.create()
     */
    create: function(req, res) {
        var trace = new traceModel({			AcceptTime : req.body.AcceptTime,			AcceptStation : req.body.AcceptStation,			Remark : req.body.Remark,			orderId : req.body.orderId
        });

        trace.save(function(err, trace){
            if(err) {
                return res.json(500, {
                    message: 'Error saving trace',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: trace._id
            });
        });
    },

    /**
     * traceController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        traceModel.findOne({_id: id}, function(err, trace){
            if(err) {
                return res.json(500, {
                    message: 'Error saving trace',
                    error: err
                });
            }
            if(!trace) {
                return res.json(404, {
                    message: 'No such trace'
                });
            }

            trace.AcceptTime =  req.body.AcceptTime ? req.body.AcceptTime : trace.AcceptTime;			trace.AcceptStation =  req.body.AcceptStation ? req.body.AcceptStation : trace.AcceptStation;			trace.Remark =  req.body.Remark ? req.body.Remark : trace.Remark;			trace.orderId =  req.body.orderId ? req.body.orderId : trace.orderId;			
            trace.save(function(err, trace){
                if(err) {
                    return res.json(500, {
                        message: 'Error getting trace.'
                    });
                }
                if(!trace) {
                    return res.json(404, {
                        message: 'No such trace'
                    });
                }
                return res.json(trace);
            });
        });
    },

    /**
     * traceController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        traceModel.findByIdAndRemove(id, function(err, trace){
            if(err) {
                return res.json(500, {
                    message: 'Error getting trace.'
                });
            }
            return res.json(trace);
        });
    }
};