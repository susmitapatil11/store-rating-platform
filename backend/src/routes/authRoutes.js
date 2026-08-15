const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/change-password', requireAuth, authController.changePassword);
router.get('/me', requireAuth, authController.me);

module.exports = router;
