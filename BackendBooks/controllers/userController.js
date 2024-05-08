const Book = require("../models/book");
const User = require("../models/user");
const Comment = require("../models/comment");
const asyncHandler = require('express-async-handler');

exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll();
    return res.status(200).json({ users });
  });