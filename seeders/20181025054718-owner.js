'use strict';

const faker = require('faker')
const _ = require('lodash')

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

    return queryInterface.bulkInsert('owners', [{
      name: '테스터',
      gender: '남',
      phone: '010-0000-0000',
      premium: faker.random.number({ min: 5, max: 20 }) * 100 * 100000,
      deposit: faker.random.number({ min: 5, max: 20 }) * 100 * 100000,
      machinePrice: faker.random.number({ min: 5, max: 8 }) * 1000 * 100000,
      etc: faker.random.number({ min: 10, max: 20 }) * 100 * 100000,
      loan: faker.random.number({ min: 5, max: 15 }) * 1000 * 100000,
      loanInterest: faker.random.number({ min: 4, max: 8 }) * 0.5,
      companyId: 1
    }])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */

    return queryInterface.bulkDelete('owners', null, {})
  }
};
