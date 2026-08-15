const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');

// normal user store browsing + rating submission
router.get('/', requireAuth, requireRole('USER'), storeController.listStoresForUser);
router.post('/:storeId/rating', requireAuth, requireRole('USER'), userController.submitRating);

module.exports = router;
