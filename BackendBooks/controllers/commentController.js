const Book = require("../models/book");
const User = require("../models/user");
const Comment = require("../models/comment");
const asyncHandler = require('express-async-handler');


exports.createComment = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const bookId = req.params.bookId;
  const author = await User.findByPk(userId);
  const book = await Book.findByPk(bookId);
  if(!book) {return res.status(404).send({ message: "Book Not found." })}
  const { body } = req.body;
  
  if (!body) {
    res.status(400).json({message: "Body is required"});
  }

  const comment = await Comment.create({ body });
  comment.setAuthor(author);
  comment.setBook(book);
  res.status(201).json({ comment });
});