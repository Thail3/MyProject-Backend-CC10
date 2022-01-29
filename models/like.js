module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define("Like", {}, { underscored: true });
  Like.associate = (models) => {
    Like.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
    });
    Like.belongsTo(models.Post, {
      foreignKey: {
        name: "commentId",
        allowNull: false,
      },
    });
    Like.belongsTo(models.Comment, {
      foreignKey: {
        name: "postId",
        allowNull: false,
      },
    });
  };
  return Like;
};
