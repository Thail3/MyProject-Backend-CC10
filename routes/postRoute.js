const express = require("express");
const authenticate = require("../middlewares/authenticate");
const postController = require("../Controllers/postController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/", authenticate, postController.getAllPost);
router.post("/", authenticate, upload.single("img"), postController.createPost);
router.delete("/:id", authenticate, postController.deletePost);

module.exports = router;
