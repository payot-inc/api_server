'use strict';
module.exports = (sequelize, DataTypes) => {
  const deviceErrorLogs = sequelize.define('deviceErrorLogs', {
    mac: {
      type:DataTypes.STRING(30),
      allowNull: false
    },
    code: DataTypes.STRING(10),
    reason: {
      type: DataTypes.STRING(200),
      defaultValue: ''
    }
  }, {});
  deviceErrorLogs.associate = function(models) {
    // associations can be defined here
  };
  return deviceErrorLogs;
};