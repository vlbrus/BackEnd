const { DataTypes} = require("sequelize");
const sequelize = require("../config/database");


const Book = sequelize.define("Book", {
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },

    book_author: {
        type: DataTypes.TEXT,
    },
}, { tableName: 'books' });

module.exports = Book;