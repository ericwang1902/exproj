var express = require('express');
var router = express.Router();
var sysuserController = require('../controllers/sysuserController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    sysuserController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    sysuserController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    sysuserController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    sysuserController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    sysuserController.remove(req, res);
});

module.exports = router;