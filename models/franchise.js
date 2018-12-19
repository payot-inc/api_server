'use strict';
module.exports = (sequelize, DataTypes) => {
  const franchise = sequelize.define('franchise', {
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: '이메일 형식이 아닙니다'
        }
      }
    },
    number: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: DataTypes.STRING(200),
    tel: DataTypes.STRING(50),
    hash: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING(200),
      allowNull: false
    }

  }, { paranoid: true });
  franchise.associate = function(models) {
    // associations can be defined here
    franchise.hasMany(models.company)
    franchise.hasMany(models.maintenance)
    franchise.hasMany(models.owner)
    franchise.hasMany(models.sms)
  };
  return franchise;
};