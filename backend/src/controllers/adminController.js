const bcrypt = require('bcryptjs');
const { Op, fn, col } = require('sequelize');
const { User, Store, Rating } = require('../models');
const { validateName, validateEmail, validateAddress, validatePassword } = require('../utils/validators');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error('getDashboardStats error:', err);
    res.status(500).json({ message: 'Could not load dashboard stats' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    const errors = {};
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const addrErr = validateAddress(address);
    const passErr = validatePassword(password);
    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
    if (addrErr) errors.address = addrErr;
    if (passErr) errors.password = passErr;
    if (!['ADMIN', 'USER', 'OWNER'].includes(role)) {
      errors.role = 'Role must be ADMIN, USER or OWNER';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password: hashed, role });

    res.status(201).json({
      id: user.id, name: user.name, email: user.email, address: user.address, role: user.role,
    });
  } catch (err) {
    console.error('createUser error:', err);
    res.status(500).json({ message: 'Could not create user' });
  }
};

// list normal + admin users (store owners are managed through the stores screen),
// with optional name/email/address/role filters and sorting
exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', sortDir = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const allowedSort = ['name', 'email', 'address', 'role'];
    const orderField = allowedSort.includes(sortBy) ? sortBy : 'name';
    const orderDir = sortDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role'],
      order: [[orderField, orderDir]],
    });

    res.json(users);
  } catch (err) {
    console.error('listUsers error:', err);
    res.status(500).json({ message: 'Could not fetch users' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'address', 'role'],
      include: [{ model: Store, as: 'store', attributes: ['id', 'name'] }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let result = user.toJSON();

    // store owners also show their store's average rating on this screen
    if (user.role === 'OWNER' && user.store) {
      const ratingStats = await Rating.findOne({
        where: { storeId: user.store.id },
        attributes: [[fn('AVG', col('value')), 'avgRating']],
        raw: true,
      });
      result.rating = ratingStats && ratingStats.avgRating ? Number(ratingStats.avgRating).toFixed(1) : null;
    }

    res.json(result);
  } catch (err) {
    console.error('getUserDetails error:', err);
    res.status(500).json({ message: 'Could not fetch user details' });
  }
};

exports.listStoreOwners = async (req, res) => {
  try {
    // used to populate the "owner" dropdown when adding a new store
    const owners = await User.findAll({
      where: { role: 'OWNER' },
      attributes: ['id', 'name', 'email'],
      include: [{ model: Store, as: 'store', attributes: ['id'] }],
    });
    const available = owners.filter((o) => !o.store);
    res.json(available);
  } catch (err) {
    console.error('listStoreOwners error:', err);
    res.status(500).json({ message: 'Could not fetch store owners' });
  }
};
