'use strict';
module.exports = (sequelize, DataTypes) => {
  const service = sequelize.define('service', {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    notice: DataTypes.TEXT,
    price: {
      type: DataTypes.DECIMAL,
      defaultValue: 0
    },
    runTimeSec: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isSales: DataTypes.DATE
  }, {});
  service.associate = function(models) {
    // associations can be defined here
    service.belongsTo(models.machine)
    service.hasMany(models.usePoint)
  };
  return service;
};