const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User
module.exports.register = async (req, res) => {
  try {
    const { name: username, password, email } = req.body;

    // Check for existing username
    const usernameCheck = await User.findOne({ where: { username } });
    if (usernameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }

    // Check for existing email
    const emailCheck = await User.findOne({ where: { email } });
    if (emailCheck) {
      return res.json({ msg: "Email already used", status: false });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const userDetails = {
      name: user.username,
      email: user.email,
    };

    const jwtToken = jwt.sign({ userDetails }, "SSC");

    return res.json({ status: true, jwtToken, userDetails });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Server issue :(", status: false });
  }
};

// Login User
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({ msg: "Email is not registered!", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect Password :(", status: false });
    }

    const userDetails = {
      name: user.username,
      email: user.email,
    };

    const jwtToken = jwt.sign({ userDetails }, "SSC");

    return res.json({ status: true, jwtToken, userDetails });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Server issue :(", status: false });
  }
};

// Edit Profile
module.exports.editProfile = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.update(
      {
        username: name,
        password: hashedPassword,
        email,
      },
      {
        where: { email },
      }
    );

    return res.status(200).json({ status: true, msg: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Server issue :(", status: false });
  }
};
