'use strict';
const _ = require('lodash')
const faker = require('faker')
const password = require('../modules/password')

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return password.create('test').then(result => {
      return {
        email: 'test@test.com',
        name: '빨래방(부산점)',
        number: '000-00-00000',
        hash: result.hash,
        salt: result.salt,
        tel: '010-0000-0000',
        address: '부산광역시 금정구 부산대학로 63번길 2, 과학기술연구동 201호',
        floor: 1,
        pointRate: 0.1,
        openDate: new Date([2016, 1, 1]).toLocaleDateString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        franchiseId: 1
      }
    }).then(data => {
      return queryInterface.bulkInsert('companies', [data])
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete('compaies', null, {});
  }
};
