// Small hand-rolled validation helpers - kept outside express so they can be unit tested
// without spinning up a server.

const NAME_MIN = 20;
const NAME_MAX = 60;
const ADDRESS_MAX = 400;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 16;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=[\];'`~/\\]/;
const UPPERCASE_REGEX = /[A-Z]/;

function validateName(name) {
  if (!name || typeof name !== 'string') return 'Name is required';
  const trimmed = name.trim();
  if (trimmed.length < NAME_MIN || trimmed.length > NAME_MAX) {
    return `Name must be between ${NAME_MIN} and ${NAME_MAX} characters`;
  }
  return null;
}

function validateEmail(email) {
  if (!email || !EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

function validateAddress(address) {
  if (address && address.length > ADDRESS_MAX) {
    return `Address must be under ${ADDRESS_MAX} characters`;
  }
  return null;
}

function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    return `Password must be ${PASSWORD_MIN}-${PASSWORD_MAX} characters long`;
  }
  if (!UPPERCASE_REGEX.test(password)) {
    return 'Password needs at least one uppercase letter';
  }
  if (!SPECIAL_CHAR_REGEX.test(password)) {
    return 'Password needs at least one special character';
  }
  return null;
}

function validateRating(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 5) {
    return 'Rating must be a whole number between 1 and 5';
  }
  return null;
}

module.exports = {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
  validateRating,
};
