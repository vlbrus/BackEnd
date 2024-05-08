const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

require('./routes/authRoutes')(app);
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to books RESTful API!" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});