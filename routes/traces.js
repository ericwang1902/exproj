var express = require('express');
var router = express.Router();
var traceController = require('../controllers/traceController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    traceController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    traceController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    traceController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    traceController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    traceController.remove(req, res);
});

module.exports = router;