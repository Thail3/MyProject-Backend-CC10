const express = require("express");
const authenticate = require("../middlewares/authenticate");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.post("/", authenticate, commentController.createComment);
router.patch("/:id", authenticate, commentController.updateComment);
router.delete("/:id", authenticate, commentController.deleteComment);

module.exports = router;
