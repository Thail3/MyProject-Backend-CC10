const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/me", authenticate, userController.getMe);
router.get("/:id", authenticate, userController.getFriendData);
router.post("/register", authController.register);
router.post("/login", authController.login);

router.patch(
  "/profile-img",
  authenticate,
  upload.single("profileImg"),
  userController.updateProfileImg
);
router.patch(
  "/background-img",
  authenticate,
  upload.single("backgroundImg"),
  userController.updateBackgroundImg
);
router.patch("/:id", authenticate, userController.updateAbout);

module.exports = router;
