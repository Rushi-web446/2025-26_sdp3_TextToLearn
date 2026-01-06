const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { addUser, findByEmail } = require("../repository/user.repository.js");

const SignupService = async ({ name, email, password }) => {
  const isExist = await findByEmail(email);

  if (isExist) {
    throw new Error("User with this email already exist");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser = {
    name: name,
    email: email,
    password: hashedPassword,
    courses: [],
  };
  newUser = await addUser(newUser);

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "5d" }
  );

  return {
    user: {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    },
    token,
  };
};

const LoginService = async ({ email, password }) => {
  const user = await findByEmail(email);
  if (!user) throw new Error("Invalid email or password"); // think about the message I am sending

  const isPasswordSame = await bcrypt.compare(password, user.password);
  if (!isPasswordSame) throw new Error("Invalid email or password"); // think about the message I am sending

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "5d" }
  );

  return {
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  };
};

module.exports = { SignupService, LoginService };
