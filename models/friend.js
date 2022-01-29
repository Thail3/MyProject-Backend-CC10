module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    "Friend",
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "REQUESTED",
        validate: {
          isIn: [["ACCEPTED", "REQUESTED"]],
        },
      },
    },
    { underscored: true }
  );
  Friend.associate = (models) => {
    Friend.belongsTo(models.User, {
      as: "RequestFrom",
      foreignKey: {
        name: "requestFromId",
        allowNull: false,
      },
    });
    Friend.belongsTo(models.User, {
      as: "RequestTo",
      foreignKey: {
        name: "requestToId",
        allowNull: false,
      },
    });
  };
  return Friend;
};
