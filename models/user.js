'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    point: {
      type: DataTypes.DECIMAL,
      defaultValue: 0
    }
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.usePoint)

    user.belongsTo(models.company)
  };
  return user;
};