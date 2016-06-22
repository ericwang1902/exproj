var locationModel = require('../models/locationModel.js');

/**
 * locationController.js
 *
 * @description :: Server-side logic for managing locations.
 */
module.exports = {

    /**
     * locationController.list()
     */
    list: function(req, res) {
        locationModel.find(function(err, locations){
            if(err) {
                return res.json(500, {
                    message: 'Error getting location.'
                });
            }
            return res.json(locations);
        });
    },

    /**
     * locationController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        locationModel.findOne({_id: id}, function(err, location){
            if(err) {
                return res.json(500, {
                    message: 'Error getting location.'
                });
            }
            if(!location) {
                return res.json(404, {
                    message: 'No such location'
                });
            }
            return res.json(location);
        });
    },

    /**
     * locationController.create()
     */
    create: function(req, res) {
        var location = new locationModel({
			company : req.body.company,
			name : req.body.name,
			tele : req.body.tele,
			postcode : req.body.postcode,
			provincename : req.body.provincename,
			cityname : req.body.cityname,
			expareaname : req.body.expareaname,
			address : req.body.address,
			userid : req.body.userid,
            type:req.body.type
        });

        location.save(function(err, location){
            if(err) {
                return res.json(500, {
                    message: 'Error saving location',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: location._id
            });
        });
    },

    /**
     * locationController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        locationModel.findOne({_id: id}, function(err, location){
            if(err) {
                return res.json(500, {
                    message: 'Error saving location',
                    error: err
                });
            }
            if(!location) {
                return res.json(404, {
                    message: 'No such location'
                });
            }

            location.company =  req.body.company ? req.body.company : location.company;
			location.name =  req.body.name ? req.body.name : location.name;
			location.tele =  req.body.tele ? req.body.tele : location.tele;
			location.postcode =  req.body.postcode ? req.body.postcode : location.postcode;
			location.provincename =  req.body.provincename ? req.body.provincename : location.provincename;
			location.cityname =  req.body.cityname ? req.body.cityname : location.cityname;
			location.expareaname =  req.body.expareaname ? req.body.expareaname : location.expareaname;
			location.address =  req.body.address ? req.body.address : location.address;
			location.userid =  req.body.userid ? req.body.userid : location.userid;
			location.type = req.body.type ?req.body.type:location.type;
            
            location.save(function(err, location){
                if(err) {
                    return res.json(500, {
                        message: 'Error getting location.'
                    });
                }
                if(!location) {
                    return res.json(404, {
                        message: 'No such location'
                    });
                }
                return res.json(location);
            });
        });
    },

    /**
     * locationController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        locationModel.findByIdAndRemove(id, function(err, location){
            if(err) {
                return res.json(500, {
                    message: 'Error getting location.'
                });
            }
            return res.json(location);
        });
    }
};