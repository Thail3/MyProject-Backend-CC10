const express = require("express");
const authenticate = require("../middlewares/authenticate");
const postController = require("../Controllers/postController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/", authenticate, postController.getAllPost);
router.get("/:id", authenticate, postController.getMyPost);
router.post("/", authenticate, upload.single("img"), postController.createPost);
router.delete("/:id", authenticate, postController.deletePost);
router.patch(
  "/:id",
  authenticate,
  upload.single("img"),
  postController.updatePost
);

module.exports = router;
