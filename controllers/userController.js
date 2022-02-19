const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { User } = require('../models');

exports.updateProfileImg = async (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) return next(err);
        await User.update(
            { profileImg: result.secure_url },
            { where: { id: req.user.id } }
        );
        //*เป็นการสร้างเงื่อนไขให้ลบไฟล์บน clound เมื่ออัพรูปใหม่ขึ้นไป
        if (req.user.profileImg) {
            const splited = req.user.profileImg.split('/');
            cloudinary.uploader.destroy(
                splited[splited.length - 1].split('.')[0]
            );
        }

        fs.unlinkSync(req.file.path);
        res.json({ message: 'update profile img completed' });
    });
};

exports.updateBackgroundImg = async (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) return next(err);
        await User.update(
            { backgroundImg: result.secure_url },
            { where: { id: req.user.id } }
        );

        const a = await User.findOne({
            where: { id: req.user.id },
        });
        //*เป็นการสร้างเงื่อนไขให้ลบไฟล์บน clound เมื่ออัพรูปใหม่ขึ้นไป
        if (req.user.backgroundImg) {
            const splited = req.user.backgroundImg.split('/');
            cloudinary.uploader.destroy(
                splited[splited.length - 1].split('.')[0]
            );
        }

        fs.unlinkSync(req.file.path);
        res.json({ a });
    });
};

exports.updateAbout = async (req, res, next) => {
    try {
        const { about } = req.body;
        const { id } = req.params;

        if (!about) {
            return res.status(400).json({ message: 'About id required' });
        }

        await User.update(
            {
                about,
            },
            { where: { id: req.user.id } }
        );

        const updateUser = await User.findOne({ where: { id } });
        res.status(200).json({ updateUser });
    } catch (err) {
        next(err);
    }
};

exports.getMe = (req, res, next) => {
    const {
        id,
        firstName,
        lastName,
        profileImg,
        email,
        about,
        phoneNumber,
        backgroundImg,
    } = req.user;
    return res.status(200).json({
        user: {
            id,
            firstName,
            lastName,
            profileImg,
            email,
            about,
            phoneNumber,
            backgroundImg,
        },
    });
};

exports.getFriendData = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findOne({
        where: { id },
    });
    res.status(200).json({ user });
};
