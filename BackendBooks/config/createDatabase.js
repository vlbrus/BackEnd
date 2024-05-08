const express = require("express");
const sequelize = require("./database");
const models = require("../models")

const sync = async () => await sequelize.sync({ force: true });
sync().then(() => {
  models.Role.create({ name: "admin" });
  models.Role.create({ name: "user" });
  models.User.create({
    email: "test@test.com",
    password: "123456",
    username: "admin",
    role_id: 1
  });

});
