const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const User = require("../models/user")
const Role = require("../models/role")

exports.signup = (req, res) => {
  //Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then(user => {
      user.setRole(2).then(() => {
        res.send({ message: "User was registered successfully!" });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }, 
      include: [{
        model: Role,
        as: "role",
      }
      ],
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ userId: user.id },
        process.env.SECRET_ACCESS_TOKEN,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 86400, // 24 hours
        });

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};