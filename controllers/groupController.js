const util = require("util");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { Group } = require("../models");

const uploadPromise = util.promisify(cloudinary.uploader.upload);

//*function createGroup โดยการ validate ว่ามีชื่อกลุ่มอยู่รึปล่าว ถ้าไม่มีให้ส่ง status 400 ออกไป
exports.createGroup = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is not required" });
    }

    let result = {};
    if (req.file) {
      result = await uploadPromise(req.file.path);
      fs.unlinkSync(req.file.path);
    }

    const gruop = await Group.create({
      title,
      adminId: req.user.id,
      img: result.secure_url,
    });

    res.status(201).json({ gruop });
  } catch (err) {
    next(err);
  }
};
