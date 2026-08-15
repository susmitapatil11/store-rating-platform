const { Op, fn, col } = require('sequelize');
const { Store, Rating, User } = require('../models');
const { validateName, validateEmail, validateAddress } = require('../utils/validators');

// admin: create a new store, optionally attaching an existing OWNER user
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const errors = {};
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const addrErr = validateAddress(address);
    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
    if (addrErr) errors.address = addrErr;

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const existing = await Store.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'A store with this email already exists' });
    }

    if (ownerId) {
      const owner = await User.findOne({ where: { id: ownerId, role: 'OWNER' } });
      if (!owner) {
        return res.status(400).json({ message: 'Selected owner is not a valid store owner account' });
      }
    }

    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    res.status(201).json(store);
  } catch (err) {
    console.error('createStore error:', err);
    res.status(500).json({ message: 'Could not create store' });
  }
};

// admin: full store list with filters/sorting + average rating
exports.listStoresForAdmin = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortDir = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      attributes: [
        'id', 'name', 'email', 'address',
        [fn('AVG', col('ratings.value')), 'avgRating'],
      ],
      group: ['Store.id'],
      subQuery: false,
    });

    let result = stores.map((s) => {
      const plain = s.toJSON();
      return {
        ...plain,
        avgRating: plain.avgRating ? Number(plain.avgRating).toFixed(1) : null,
      };
    });

    const allowedSort = ['name', 'email', 'address', 'avgRating'];
    const field = allowedSort.includes(sortBy) ? sortBy : 'name';
    const dir = sortDir.toUpperCase() === 'DESC' ? -1 : 1;
    result.sort((a, b) => {
      const av = a[field] ?? '';
      const bv = b[field] ?? '';
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });

    res.json(result);
  } catch (err) {
    console.error('listStoresForAdmin error:', err);
    res.status(500).json({ message: 'Could not fetch stores' });
  }
};

// normal user: browse stores, search by name/address, see own submitted rating
exports.listStoresForUser = async (req, res) => {
  try {
    const { name, address } = req.query;
    const userId = req.user.id;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, as: 'ratings' }],
      order: [['name', 'ASC']],
    });

    const result = stores.map((store) => {
      const ratings = store.ratings || [];
      const avg = ratings.length
        ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(1)
        : null;
      const own = ratings.find((r) => r.userId === userId);

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        avgRating: avg,
        userRating: own ? own.value : null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('listStoresForUser error:', err);
    res.status(500).json({ message: 'Could not fetch stores' });
  }
};
