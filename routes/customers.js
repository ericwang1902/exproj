var express = require('express');
var router = express.Router();
var customerController = require('../controllers/customerController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    customerController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    customerController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    customerController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    customerController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    customerController.remove(req, res);
});

module.exports = router;