var express = require('express');
var router = express.Router();
var LogisticDataController = require('../controllers/LogisticDataController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    LogisticDataController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    LogisticDataController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    LogisticDataController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    LogisticDataController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    LogisticDataController.remove(req, res);
});

module.exports = router;