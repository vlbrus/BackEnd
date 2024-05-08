const Book = require("../models/book");
const User = require("../models/user");
const Comment = require("../models/comment");
const asyncHandler = require('express-async-handler');
const slugify = require("slugify");

exports.createBook = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const author = await User.findByPk(userId);
  const { title, description,  book_author} = req.body;

  if (!title || !description || !book_author) {
    res.status(400).json({ message: "All fields are required" });
  }
  const slug = slugify(title, { lower: true });
  const slugInDB = await Book.findOne({ where: { slug: slug } });
  if (slugInDB) res.status(400).json({ message: "Title already exists" });

  const book = await Book.create({ slug, title, description,  book_author });
  book.setAuthor(author);
  res.status(201).json({ book });
});

exports.getAllBooks = asyncHandler(async (req, res) => {
  const viewOptions = {
    attributes: {exclude: ["author_id"] },
    include: [
      { model: User, as: "author", attributes: {exclude: ["email", "password", "role_id"] } },
      {
        model: Comment,
        as: "comment",
        attributes: ["body"],
        include: [
          {
            model: User,
            as: "author",
            attributes: ['id', 'username']
          }
        ],
        order: [["createdAt", "DESC"]]
      }
    ],
    order: [["createdAt", "DESC"]]
  };

  const books = await Book.findAll(viewOptions);

  res
    .status(200)
    .json({ books });
});

exports.getBook = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
   const viewOptions = {
    where: { slug: slug },
    attributes: {exclude: ["author_id"] },
    include: [
      { model: User, as: "author", attributes: {exclude: ["email", "password", "role_id"] }},
      {
        model: Comment,
        as: "comment",
        attributes: ["body"],
        include: [
          {
            model: User,
            as: "author",
            attributes: ['id', 'username']
          }
        ],
        order: [["createdAt", "DESC"]]
      }
    ]
  };

  const book = await Book.findOne(viewOptions);

  if (!book) return next(new ErrorResponse("Book not found", 404));
  res.status(200).json({ book });
});

exports.deleteBook = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const userId = req.userId;

  const book = await Book.findOne({
    where: { slug: slug }
  });
  if (!book) next(new ErrorResponse("Book not found", 404));

  if (book.authorId !== userId)
    return next(new ErrorResponse("Unauthorized", 401));

  await book.destroy();

  res.status(200).json({ book });
});
