'use strict';
module.exports = (sequelize, DataTypes) => {
  const claim = sequelize.define('claim', {
    reason: DataTypes.TEXT,
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {});
  claim.associate = function(models) {
    // associations can be defined here
    claim.belongsTo(models.company)
    claim.belongsTo(models.machine)
  };
  return claim;
};