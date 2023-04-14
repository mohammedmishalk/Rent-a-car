const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const validateAdminToken = (req, res, next) => {
  const token = req.header('Authorization');
  // console.log(token)
  if (token === 'Bearer null') {
    return res.status(401).send('Access Denied. No token provided.');
  }

  try {
    // eslint-disable-next-line no-unused-vars
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decoded)
    if (decoded.accountType =='admin') {
      return next();
    }
    throw new Error();
  } catch (error) {
    return res.status(403).send('Invalid Token.');
  }
};

module.exports = validateAdminToken;