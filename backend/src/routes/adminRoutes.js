const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const storeController = require('../controllers/storeController');

router.use(requireAuth, requireRole('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);

router.post('/users', adminController.createUser);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserDetails);
router.get('/store-owners', adminController.listStoreOwners);

router.post('/stores', storeController.createStore);
router.get('/stores', storeController.listStoresForAdmin);

module.exports = router;
