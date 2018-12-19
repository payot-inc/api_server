'use strict';
module.exports = (sequelize, DataTypes) => {
  const owner = sequelize.define('owner', {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(1),
      defaultValue: '남'
    },
    birthDate: DataTypes.DATEONLY,
    phone: DataTypes.STRING(50),
    premium: DataTypes.DECIMAL,
    deposit: DataTypes.DECIMAL,
    machinePrice: DataTypes.DECIMAL,
    loan: DataTypes.DECIMAL,
    loanInterest: DataTypes.FLOAT,
    etc: DataTypes.DECIMAL

  }, { timestamps: false });
  owner.associate = function(models) {
    // associations can be defined here
    owner.belongsTo(models.company)
    owner.belongsTo(models.franchise)
  };
  return owner;
};