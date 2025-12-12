const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

connectDB(); // Connect to MongoDB

// Import routes
const authRoute = require('./routes/authRoute.js');
const coursesRoute = require('./routes/coursesRoute.js');


// Routes
app.get("/", (req, res) => {
    res.send("Welcome to MERN API");
});

app.use("/auth", authRoute);
app.use("/courses", coursesRoute);



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});


// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
