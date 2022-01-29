module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    "Group",
    {
      title: {
        type: DataTypes.STRING,
      },
      img: DataTypes.STRING,
    },
    { underscored: true }
  );
  Group.associate = (models) => {
    Group.hasMany(models.Post, {
      foreignKey: {
        name: "groupId",
        allowNull: true,
      },
    });
    Group.hasMany(models.Member, {
      foreignKey: {
        name: "groupId",
        allowNull: false,
      },
    });
    Group.belongsTo(models.User, {
      foreignKey: {
        name: "adminId",
        allowNull: false,
      },
    });
  };
  return Group;
};
