'use strict';
module.exports = (sequelize, DataTypes) => {
  const usePoint = sequelize.define('usePoint', {
    phone: DataTypes.STRING,
    amount: {
      type: DataTypes.DECIMAL,
      defaultValue: 0
    }
  }, {});
  usePoint.associate = function(models) {
    // associations can be defined here
    usePoint.belongsTo(models.service)
  };
  return usePoint;
};