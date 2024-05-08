const express = require('express');
const router = express.Router();
const authJwt = require('../middleware/authJwt');
const bookController = require('../controllers/bookController');

router.post('/', authJwt.verifyToken, bookController.createBook);
router.get('/', bookController.getAllBooks)
router.get('/:slug', bookController.getBook)
router.delete('/:slug',authJwt.verifyToken, bookController.deleteBook);

module.exports = router