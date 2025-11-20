const express = require('express');
const router = express.Router();

router.use('/users', require('./user.route'));
router.use('/vehicles', require('./vehicles.route'));
router.use('/positions', require('./position.route'));

module.exports = router;
