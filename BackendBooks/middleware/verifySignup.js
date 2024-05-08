const db = require("../config/database");
const models = require("../models")

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  models.User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
    }
  });
  // Email
  models.User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
    }
  });
  next();
};


const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  // checkRoleExisted: checkRoleExisted
};

module.exports = verifySignUp;