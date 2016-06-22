var express = require('express');
var router = express.Router();
var locationController = require('../controllers/locationController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    locationController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    locationController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    locationController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    locationController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    locationController.remove(req, res);
});

module.exports = router;