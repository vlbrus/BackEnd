// Import Models
const User = require("../models/user");
const Book = require("../models/book");
const Comment = require("../models/comment");
const Role = require("../models/role");

// Relations
  User.hasMany(Book, {
    foreignKey: "author_id",
    onDelete: "CASCADE",
  });
  Book.belongsTo(User, { as: "author", foreignKey: "author_id" });
  
  User.hasMany(Comment, {
    foreignKey: "author_id",
    onDelete: "CASCADE",
  });
  Comment.belongsTo(User, { as: "author", foreignKey: "author_id" });
  
  Book.hasMany(Comment, {
    as: "comment",
    foreignKey: "book_id",
    onDelete: "CASCADE",
  });
  Comment.belongsTo(Book, { as: "book", foreignKey: "book_id" });
  
  Role.hasMany(User, {
    foreignKey: "role_id",
    onDelete: "CASCADE",
  });
  User.belongsTo(Role, { as: "role", foreignKey: "role_id" });
  
  const models = {
    User: User,
    Book: Book,
    Role: Role,
    Comment: Comment
  }

  module.exports = models