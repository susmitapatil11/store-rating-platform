const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const ownerController = require('../controllers/ownerController');

router.get('/overview', requireAuth, requireRole('OWNER'), ownerController.getMyStoreOverview);

module.exports = router;
