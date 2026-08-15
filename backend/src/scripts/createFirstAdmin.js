// One-off script to bootstrap the first admin account, since admins can only
// be created by other admins and the system starts out with none.
//
// Usage:  node src/scripts/createFirstAdmin.js

require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const { User } = require('../models');

const ADMIN_NAME = 'Platform Administrator Account';   // TODO: replace with a real name (20-60 chars)
const ADMIN_EMAIL = 'admin@storerating.com';                 // TODO: replace with real email
const ADMIN_PASSWORD = 'Admin@1234';                     // TODO: change after first login
const ADMIN_ADDRESS = 'Head Office';

async function run() {
  await sequelize.sync();

  const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log('An admin with this email already exists, nothing to do.');
    process.exit(0);
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashed,
    address: ADMIN_ADDRESS,
    role: 'ADMIN',
  });

  console.log('First admin created:');
  console.log(`  email: ${ADMIN_EMAIL}`);
  console.log(`  password: ${ADMIN_PASSWORD}`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
