module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      about: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileImg: DataTypes.STRING,
      backgroundImg: DataTypes.STRING,
    },
    { underscored: true }
  );
  User.associate = (models) => {
    User.hasMany(models.Post, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
    });
    User.hasMany(models.Comment, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
    });
    User.hasMany(models.Like, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
    });
    User.hasMany(models.Friend, {
      as: "RequestFrom",
      foreignKey: {
        name: "requestFromId",
        allowNull: false,
      },
    });
    User.hasMany(models.Friend, {
      as: "RequestTo",
      foreignKey: {
        name: "requestToId",
        allowNull: false,
      },
    });
  };
  return User;
};
