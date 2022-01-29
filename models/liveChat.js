module.exports = (sequelize, DataTypes) => {
  const LiveChat = sequelize.define(
    "LiveChat",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );
  LiveChat.associate = (models) => {
    LiveChat.belongsTo(models.User, {
      as: "ReciverFrom",
      foreignKey: {
        name: "reciverId",
        allowNull: false,
      },
    });
    LiveChat.belongsTo(models.User, {
      as: "SenderTo",
      foreignKey: {
        name: "senderId",
        allowNull: false,
      },
    });
  };
  return LiveChat;
};
