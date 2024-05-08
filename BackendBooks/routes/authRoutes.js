const verifySignUp = require("../middleware/verifySignup");
const controller = require("../controllers/authController");
const validator = require("../config/validationbody")

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      validator.createUserValidator
    ],
    controller.signup
  );

  app.post("/api/auth/signin", validator.loginValidator, controller.signin);
};