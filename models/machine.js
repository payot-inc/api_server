'use strict';
module.exports = (sequelize, DataTypes) => {
  const machine = sequelize.define('machine', {
    mac: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    size: DataTypes.STRING(10),
    brand: DataTypes.STRING(20),
    price: DataTypes.DECIMAL,
    serviceAmount: {
      type: DataTypes.DECIMAL,
      defaultValue: 0
    },
    stopTime: DataTypes.DATE,
    isService: DataTypes.DATE,
    stopReason: DataTypes.TEXT,
    serviceRuntimeSec: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    installAt: DataTypes.DATEONLY
  }, { paranoid: true });
  machine.associate = function (models) {
    // associations can be defined here
    machine.belongsTo(models.company)

    machine.hasMany(models.service)
    machine.hasMany(models.claim)
  };
  return machine;
};