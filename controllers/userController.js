const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { User } = require("../models");

exports.updateProfileImg = async (req, res, next) => {
  console.log(req.file);

  cloudinary.uploader.upload(req.file.path, async (err, result) => {
    if (err) return next(err);
    await User.update(
      { profileImg: result.secure_url },
      { where: { id: req.user.id } }
    );
    //*เป็นการสร้างเงื่อนไขให้ลบไฟล์บน clound เมื่ออัพรูปใหม่ขึ้นไป
    if (req.user.profileImg) {
      const splited = req.user.profileImg.split("/");
      cloudinary.uploader.destroy(splited[splited.length - 1].split(".")[0]);
    }

    fs.unlinkSync(req.file.path);
    res.json({ message: "update profile img completed" });
  });
};

exports.getMe = (req, res, next) => {
  const { id, firstName, lastName, profileImg, email, phoneNumber } = req.user;
  return res
    .status(200)
    .json({
      user: { id, firstName, lastName, profileImg, email, phoneNumber },
    });
};
