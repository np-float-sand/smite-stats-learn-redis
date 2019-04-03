const router = require('express').Router();

router.use('/gods', require('./gods'));
router.use('/stats', require('./stats'));
//router.use('/repos', require('./repos'))

module.exports = router;