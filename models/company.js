'use strict';
module.exports = (sequelize, DataTypes) => {
  const company = sequelize.define('company', {
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: '정확한 이메일 형식이 아닙니다'
        }
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    number: {
      type: DataTypes.STRING(50),
      unique: true
    },

    hash: {
      type: DataTypes.STRING(300),
      allowNull: false
    },

    salt:{
      type: DataTypes.STRING(200),
      allowNull: false
    },

    tel: DataTypes.STRING(50),
    space: DataTypes.FLOAT,
    address: {
      type: DataTypes.STRING(200),
      allowNull: false
    },

    floor: DataTypes.INTEGER,

    pointRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    openDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }

  }, { paranoid: true });
  company.associate = function(models) {
    // associations can be defined here
    company.belongsTo(models.franchise)

    company.hasOne(models.owner)

    company.hasMany(models.maintenance)
    company.hasMany(models.machine)
    company.hasMany(models.user)
    company.hasMany(models.payments)
    company.hasMany(models.sms)
    company.hasMany(models.claim)
  };
  return company;
};

