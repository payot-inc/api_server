'use strict';
module.exports = (sequelize, DataTypes) => {
  const maintenance = sequelize.define('maintenance', {
    electric: DataTypes.DECIMAL,
    gas: DataTypes.DECIMAL,
    water: DataTypes.DECIMAL,
    spaceRant: DataTypes.DECIMAL,
    management: DataTypes.DECIMAL,
    repiar: DataTypes.DECIMAL,
    etc: DataTypes.DECIMAL,
    targetDate: DataTypes.DATEONLY,

  }, { timestamps: false });
  maintenance.associate = function(models) {
    // associations can be defined here
    maintenance.belongsTo(models.company)
  };
  return maintenance;
};