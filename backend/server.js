// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const connectDB = require('./config/db.js');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// connectDB(); // Connect to MongoDB

// // Import routes
// const authRoute = require('./routes/auth.route.js');
// const coursesRoute = require('./routes/course.route.js');
// const userRoute = require('./routes/user.route.js');
// const ur = require('./routes/YouTube.routes.js');

// // // Routes
// // app.get("/", (req, res) => {
// //     res.send("\n@@@Welcome to MERN API@@@\n");
// // });


// const userRoutes = require("./routes/user.route");



// const checkJwt = require('./middleware/auth.middleware');
// const syncUser = require('./middleware/user.sync.middleware');

// app.use("/auth", authRoute); // Keep for legacy or remove later
// app.use("/user", checkJwt, syncUser, userRoute);
// app.use("/y", ur);






  
  
  
  const express = require("express");
  const cors = require("cors");
  require("dotenv").config();
  const connectDB = require("./config/db");
  
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  connectDB();
  
  const userRoutes = require("./routes/user.route");
  
  app.use("/course", checkJwt, syncUser, coursesRoute);
  app.use("/user", userRoutes);
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


