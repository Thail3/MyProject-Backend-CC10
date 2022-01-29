const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const emailFormat =
  /^\w+([\.-]?\w+)*@(list.)?gmail.com+((\s*)+,(\s*)+\w+([\.-]?\w+)*@(list.)?gmail.com)*$/;

exports.register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      emailOrPhoneNumber,
      password,
      confirmPassword,
    } = req.body;
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "password and confirm password did not match" });
    }
    const isEmail = emailFormat.test(emailOrPhoneNumber);
    if (isEmail) {
      const existUser = await User.findOne({
        where: { email: emailOrPhoneNumber },
      });
      if (existUser) {
        return res.status(400).json({ message: "This email is already use" });
      }
    } else {
      const existUser = await User.findOne({
        where: { phoneNumber: emailOrPhoneNumber },
      });
      if (existUser) {
        return res
          .status(400)
          .json({ message: "This phone number is already use" });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      firstName,
      lastName,
      email: isEmail ? emailOrPhoneNumber : null,
      phoneNumber: !isEmail ? emailOrPhoneNumber : null,
      password: hashedPassword,
    });
    res.status(201).json({ message: "user created" });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { emailOrPhoneNumber, password } = req.body;
    const isEmail = emailFormat.test(emailOrPhoneNumber);
    let user;
    if (isEmail) {
      user = await User.findOne({ where: { email: emailOrPhoneNumber } });
    } else {
      user = await User.findOne({ where: { phoneNumber: emailOrPhoneNumber } });
    }

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email, phone number of password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email, phone number of password" });
    }
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const { id, firstName, lastName, profileImg, email, phoneNumber } = user;

    res.status(200).json({
      token,
      user: { id, firstName, lastName, profileImg, email, phoneNumber },
    });
  } catch (e) {
    next(e);
  }
};
