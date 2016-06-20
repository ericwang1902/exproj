var express = require('express');
var router = express.Router();
var fanController = require('../controllers/fanController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    fanController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    fanController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    fanController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    fanController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    fanController.remove(req, res);
});

module.exports = router;