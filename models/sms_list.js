'use strict';
module.exports = (sequelize, DataTypes) => {
  const sms_list = sequelize.define('sms_list', {
    message: DataTypes.STRING,
    from: DataTypes.STRING,
    companyId: DataTypes.INTEGER,
    franchiseId: DataTypes.INTEGER,
    sender: DataTypes.STRING(10),
    count: DataTypes.INTEGER,
  }, {});
  sms_list.associate = function(models) {
    // associations can be defined here
  };
  return sms_list;
};