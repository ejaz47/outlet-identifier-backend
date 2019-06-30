const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const ctrl = require('./outlet_controller.js');


// a simple test url to check that all of our files are communicating correctly.

router.get('/', ctrl.get_outlet);
// router.post('/create', ctrl.validator('create'), ctrl.create);
// router.put('/:id/update', ctrl.validator('update'), ctrl.product_update);
// router.delete('/:id/delete', ctrl.validator('delete'), ctrl.product_delete);
module.exports = router;