// const User = require('../models/user');

// const syncUser = async (req, res, next) => {
//     try {
//         const auth0Id = req.auth.payload.sub;
//         const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`] || req.auth.payload.email; // Namespace custom claim or standard claim

//         let user = await User.findOne({ auth0Id });

//         if (!user) {
//             // Try finding by email to link legacy accounts (optional logic, be careful with security here)
//             // For now, we'll assume we want to create a new user or link if email exists.
//             user = await User.findOne({ email });

//             if (user) {
//                 // Link existing legacy user to Auth0 ID
//                 user.auth0Id = auth0Id;
//                 await user.save();
//             } else {
//                 // Create new user
//                 user = new User({
//                     auth0Id,
//                     email, // You might need to add a rule in Auth0 to include email in token
//                     name: email ? email.split('@')[0] : 'User', // Fallback name
//                 });
//                 await user.save();
//             }
//         }

//         req.user = user; // Attach user to request object for downstream use
//         console.log("Middleware: User synced successfully", user._id);
//         next();
//     } catch (error) {
//         console.error("Error syncing user:", error);
//         return res.status(500).json({ message: "Internal Server Error during user sync" });
//     }
// };

// module.exports = syncUser;



const User = require("../models/user");

const axios = require("axios");

const syncUser = async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];

  const { data } = await axios.get(
    `https://dev-4xlxb5a75bgzk3js.us.auth0.com/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const { sub, email, name } = data;

  let user = await User.findOne({ auth0Id: sub });

  if (!user) {
    user = await User.create({
      auth0Id: sub,
      email,
      name,
    });
  }

  req.appUser = user;
  next();
};

module.exports = syncUser;
