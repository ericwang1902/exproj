var express = require('express');
var router = express.Router();
var sysorderController = require('../controllers/sysorderController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    sysorderController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    sysorderController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    sysorderController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    sysorderController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    sysorderController.remove(req, res);
});

module.exports = router;