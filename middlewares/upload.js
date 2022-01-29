const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "publics/images"); //*"public/images" เป็นที่อยู่ไฟล์ โดยเราต้องไปสร้างไฟล์ public ก่อนค่อยไปสร้างไฟล์ images ข้างในไฟล์ public
  },
  filename: (req, file, cb) => {
    cb(null, "" + new Date().getTime() + "." + file.mimetype.split("/")[1]); //*new Date().getTime() เป็นชื่อไฟล์
  },
});
module.exports = multer({ storage });
