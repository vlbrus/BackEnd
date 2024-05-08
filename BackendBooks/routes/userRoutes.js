const express = require('express');
const router = express.Router();
const authJwt = require('../middleware/authJwt');
const userController = require('../controllers/userController');

router.get('/', [authJwt.verifyToken, authJwt.isAdmin], userController.getAllUsers)

module.exports = router