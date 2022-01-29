module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: {
        type: DataTypes.STRING,
      },
      img: DataTypes.STRING,
    },
    { underscored: true }
  );
  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
    });
    Post.hasMany(models.Comment, {
      foreignKey: {
        name: "postId",
        allowNull: false,
      },
    });
    Post.hasMany(models.Like, {
      foreignKey: {
        name: "postId",
        allowNull: false,
      },
    });
    Post.belongsTo(models.Group, {
      foreignKey: {
        name: "groupId",
        allowNull: true,
      },
    });
  };
  return Post;
};
