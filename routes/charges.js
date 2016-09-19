var express = require('express');
var router = express.Router();
var chargeController = require('../controllers/chargeController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    chargeController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    chargeController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    chargeController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    chargeController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    chargeController.remove(req, res);
});

module.exports = router;