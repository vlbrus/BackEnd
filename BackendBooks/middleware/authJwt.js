const jwt = require('jsonwebtoken');
require('dotenv').config()
const models = require("../models")

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  models.User.findByPk(req.userId).then(user => {
    user.getRole().then(role => {
      if (role.name === "admin") {
        next();
      }else
      return res.status(403).send({
        message: "Require Admin Role!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
};

module.exports = authJwt;