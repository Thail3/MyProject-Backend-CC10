const express = require("express");
const authenticate = require("../middlewares/authenticate");
const likeController = require("../controllers/likeController");

const router = express.Router();

router.post("/", authenticate, likeController.createLike);

module.exports = router;
