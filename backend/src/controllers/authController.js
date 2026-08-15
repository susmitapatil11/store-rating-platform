const bcrypt = require('bcryptjs');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');
const { validateName, validateEmail, validateAddress, validatePassword } = require('../utils/validators');

// Public signup - always creates a normal USER account.
// Admins/store owners are created separately by an admin.
exports.signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    const errors = {};
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const addrErr = validateAddress(address);
    const passErr = validatePassword(password);
    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
    if (addrErr) errors.address = addrErr;
    if (passErr) errors.password = passErr;

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      address,
      password: hashed,
      role: 'USER',
    });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('signup error:', err);
    res.status(500).json({ message: 'Something went wrong while creating your account' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Something went wrong while logging in' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const passErr = validatePassword(newPassword);
    if (passErr) {
      return res.status(400).json({ message: passErr });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('changePassword error:', err);
    res.status(500).json({ message: 'Something went wrong while updating your password' });
  }
};

exports.me = async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'address', 'role'] });
  res.json(user);
};
