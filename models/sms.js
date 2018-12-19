'use strict';
module.exports = (sequelize, DataTypes) => {
  const sms = sequelize.define('sms', {
    sendType: DataTypes.STRING(100),
    from: DataTypes.STRING(),
    message: DataTypes.STRING,
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {});
  sms.associate = function(models) {
    // associations can be defined here
    sms.belongsTo(models.company);
    sms.belongsTo(models.franchise);
  };
  return sms;
};