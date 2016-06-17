var customerModel = require('../models/customerModel.js');

/**
 * customerController.js
 *
 * @description :: Server-side logic for managing customers.
 */
module.exports = {

    /**
     * customerController.list()
     */
    list: function(req, res) {
        customerModel.find(function(err, customers){
            if(err) {
                return res.json(500, {
                    message: 'Error getting customer.'
                });
            }
            return res.json(customers);
        });
    },

    /**
     * customerController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        customerModel.findOne({_id: id}, function(err, customer){
            if(err) {
                return res.json(500, {
                    message: 'Error getting customer.'
                });
            }
            if(!customer) {
                return res.json(404, {
                    message: 'No such customer'
                });
            }
            return res.json(customer);
        });
    },

    /**
     * customerController.create()
     */
    create: function(req, res) {
        var customer = new customerModel({			openid : req.body.openid,			courierid : req.body.courierid,			username : req.body.username,			psd : req.body.psd
        });

        customer.save(function(err, customer){
            if(err) {
                return res.json(500, {
                    message: 'Error saving customer',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: customer._id
            });
        });
    },

    /**
     * customerController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        customerModel.findOne({_id: id}, function(err, customer){
            if(err) {
                return res.json(500, {
                    message: 'Error saving customer',
                    error: err
                });
            }
            if(!customer) {
                return res.json(404, {
                    message: 'No such customer'
                });
            }

            customer.openid =  req.body.openid ? req.body.openid : customer.openid;			customer.courierid =  req.body.courierid ? req.body.courierid : customer.courierid;			customer.username =  req.body.username ? req.body.username : customer.username;			customer.psd =  req.body.psd ? req.body.psd : customer.psd;			
            customer.save(function(err, customer){
                if(err) {
                    return res.json(500, {
                        message: 'Error getting customer.'
                    });
                }
                if(!customer) {
                    return res.json(404, {
                        message: 'No such customer'
                    });
                }
                return res.json(customer);
            });
        });
    },

    /**
     * customerController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        customerModel.findByIdAndRemove(id, function(err, customer){
            if(err) {
                return res.json(500, {
                    message: 'Error getting customer.'
                });
            }
            return res.json(customer);
        });
    }
};