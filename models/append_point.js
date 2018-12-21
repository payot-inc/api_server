'use strict';
module.exports = (sequelize, DataTypes) => {
  const append_point = sequelize.define('append_point', {
    point: DataTypes.INTEGER,
    manyPerson: DataTypes.INTEGER,
    notice: DataTypes.STRING(100),
  }, {});
  append_point.associate = function(models) {
    // associations can be defined here
    append_point.belongsTo(models.company);
  };
  return append_point;
};