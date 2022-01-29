module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define("Member", {}, { underscored: true });
  Member.associate = (models) => {
    Member.belongsTo(models.Group, {
      foreignKey: {
        name: "groupId",
        allowNull: false,
      },
    });
    Member.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
    });
  };
  return Member;
};
