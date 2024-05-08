const express = require('express');
const router = express.Router();
const authJwt = require('../middleware/authJwt');
const commentController = require('../controllers/commentController');

router.post('/:bookId', authJwt.verifyToken, commentController.createComment);

module.exports = router