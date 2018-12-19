'use strict';
module.exports = (sequelize, DataTypes) => {
  const payments = sequelize.define('payments', {
    mac: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    payAt: DataTypes.DATE

  }, { timestamps: false });
  payments.associate = function(models) {
    // associations can be defined here

    payments.belongsTo(models.company)

    payments.belongsTo(models.franchise)

    payments.belongsTo(models.machine, { foreignKey: 'mac', targetKey: 'mac' })
  };
  return payments;
};