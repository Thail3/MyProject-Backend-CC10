const util = require("util");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { Op } = require("sequelize");
const { Like, Comment, Post, Friend, User, sequelize } = require("../models");

const uploadPromise = util.promisify(cloudinary.uploader.upload);
//*!ตอนนี้ติดปัญหา เรื่องของ group_id type มันต้องเป็น notnull หรือ ปล่าว ถ้าโพสไม่จำเป็นต้องมี group_id เพราะโพสเป็นโพสสาธารณะ ไม่ได้ไปโพสในกลุ่มแต่อย่างใด  notNull Violation: Post.groupId cannot be null
//* function createPost
exports.createPost = async (req, res, next) => {
  try {
    const { title } = req.body;
    //*ถ้า title ไม่มีค่าและ req.file ไม่มีค่าจะ return status 400
    if (!title && !req.file) {
      return res.status(400).json({ message: "Title or image is required" });
    }

    let result = {};
    if (req.file) {
      result = await uploadPromise(req.file.path);
      fs.unlinkSync(req.file.path);
    }

    const post = await Post.create({
      title,
      userId: req.user.id,
      img: result.secure_url,
    });

    res.status(201).json({ post });
  } catch (e) {
    next(e);
  }
};
//*function updatePost
exports.updatePost = async (req, res, next) => {
  try {
    const { title } = req.body;
    console.log(title);
    const { id } = req.params;
    if (!title && !req.file) {
      return res.status(400).json({ message: "Title or image is required" });
    }
    let result = {};
    if (req.file) {
      result = await uploadPromise(req.file.path);
      fs.unlinkSync(req.file.path);
    }

    await Post.update(
      {
        title,
        img: result.secure_url,
      },
      { where: { id, userId: req.user.id } }
    );

    const updatedPost = await Post.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "profileImg", "about"],
        },
        {
          model: Comment,

          include: {
            model: User,
            attributes: ["id", "firstName", "lastName", "profileImg"],
          },
        },
        { model: Like, attributes: ["id", "userId", "postId"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    console.log(updatedPost);

    res.status(201).json({ updatedPost });
  } catch (e) {
    next(e);
  }
};
//*function deletePost
exports.deletePost = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    await Like.destroy({ where: { postId: id } }, { transaction });
    await Comment.destroy({ where: { postId: id } }, { transaction });
    await Post.destroy({ where: { id } }, { transaction });

    await transaction.commit();
    res.status(204).json();
  } catch (e) {
    next(e);
  }
};
//*function ดูโพสของเพื่อนทุกคน
exports.getAllPost = async (req, res, next) => {
  try {
    const friends = await Friend.findAll({
      where: {
        [Op.or]: [{ requestToId: req.user.id }, { requestFromId: req.user.id }],
        status: "ACCEPTED",
      },
    });

    const userIds = friends.reduce(
      (acc, item) => {
        if (req.user.id === item.requestFromId) {
          acc.push(item.requestToId);
        } else {
          acc.push(item.requestFromId);
        }
        return acc;
      },
      [req.user.id]
    );

    const posts = await Post.findAll({
      // where: { userId: req.user.id },
      where: { userId: userIds },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "profileImg",
            "about",
            "backgroundImg",
          ],
        },
        {
          model: Comment,

          include: {
            model: User,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "profileImg",
              "backgroundImg",
            ],
          },
        },
        { model: Like, attributes: ["id", "userId", "postId"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ posts });
  } catch (e) {
    next(e);
  }
};

exports.getMyPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const myPost = await Post.findAll({
      where: { userId: id },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "profileImg",
            "about",
            "backgroundImg",
          ],
        },
        {
          model: Comment,

          include: {
            model: User,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "profileImg",
              "backgroundImg",
            ],
          },
        },
        { model: Like, attributes: ["id", "userId", "postId"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ myPost });
  } catch (e) {
    next(e);
  }
};
