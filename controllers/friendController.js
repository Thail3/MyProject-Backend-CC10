const { Op } = require("sequelize");
const { Friend, User } = require("../models");

exports.getUnknownUsers = async (req, res, next) => {
  try {
    const friends = await Friend.findAll({
      where: {
        [Op.or]: [{ requestToId: req.user.id }, { requestFromId: req.user.id }],
      },
    });

    const friendIds = friends.reduce(
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
    const users = await User.findAll({
      where: { id: { [Op.notIn]: friendIds } },
    });
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

//*เรียกดูเพื่อน secound thing i do
exports.getAllFriends = async (req, res, next) => {
  try {
    const { status, searchName } = req.query;
    let where = {
      [Op.or]: [{ requestToId: req.user.id }, { requestFromId: req.user.id }],
    };
    if (status === "ACCEPTED") {
      where = {
        [Op.or]: [{ requestToId: req.user.id }, { requestFromId: req.user.id }],
      };
    } else if (status === "REQUESTED") {
      where = { status, requestToId: req.user.id };
    }

    const friends = await Friend.findAll({
      where,
    });

    const friendIds = friends.reduce((acc, item) => {
      if (req.user.id === item.requestFromId) {
        acc.push(item.requestToId);
      } else {
        acc.push(item.requestFromId);
      }
      return acc;
    }, []);

    let userWhere = {};
    if (searchName) {
      userWhere = {
        [Op.or]: [
          {
            firstName: {
              [Op.substring]: searchName,
            },
            lastName: {
              [Op.substring]: searchName,
            },
          },
        ],
      };
    }

    const users = await User.findAll({
      where: {
        id: friendIds,
        ...userWhere,
      },
      attributes: { exclude: ["password"] },
    });
    res.status(200).json({ users });
  } catch (e) {
    next(e);
  }
};

//*ส่งคำขอร้องเป็นเพื่อน first thing i do
exports.requestFriend = async (req, res, next) => {
  try {
    const { requestToId } = req.body;
    //!เช็คดูว่า user.id เท่ากับ requestToId หรือไม่ ถ้ามันเท่ากันให้ส่ง status 400 Bad Request ไป
    if (req.user.id === requestToId) {
      return res.status(400).json({ message: "Cannot request yourself." });
    }

    const existFriend = await Friend.findOne({
      where: {
        [Op.or]: [
          { requestFromId: req.user.id, requestToId },
          { requestFromId: requestToId, requestToId: req.user.id },
        ],
      },
    });
    if (existFriend) {
      return res
        .status(400)
        .json({ message: "This Friend has already been requested" });
    }
    await Friend.create({
      requestToId,
      status: "REQUESTED",
      requestFromId: req.user.id,
    });
    res.status(200).json({ message: "Request has been sent" });
  } catch (e) {
    next(e);
  }
};
//*ตอบรับคำขอของเพื่อน Third thing i do
exports.updateFriend = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const friend = await Friend.findOne({
      where: {
        requestToId: req.user.id,
        requestFromId: friendId,
        status: "REQUESTED",
      },
    });
    console.log(friend);
    console.log(req.user.id);
    console.log(friendId);
    //!ถ้าไม่เจอ friend มันจะส่ง status 400 Bad Request
    if (!friend) {
      return res.status(400).json({ message: "This friend request not found" });
    }
    friend.status = "ACCEPTED";
    await friend.save();
    res.status(200).json({ message: "Friend request accepted" });
  } catch (e) {
    next(e);
  }
};
///*ลบเพื่อน
exports.deleteFriend = async (req, res, next) => {
  try {
    const { friendId } = req.params;

    const friend = await Friend.findOne({
      where: {
        [Op.or]: [
          { requestToId: req.user.id, requestFromId: friendId },
          { requestToId: friendId, requestFromId: req.user.id },
        ],
      },
    });

    if (!friend) {
      return res.status(400).json({ message: "This friend request not found" });
    }

    await friend.destroy();
    res.status(204).json();
  } catch (e) {
    next(e);
  }
};
