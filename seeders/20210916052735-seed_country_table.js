'use strict';

// if you are making use of mysql then don't create the schema just start creating the database and tables.
// let tableModel = { schema: 'app', tableName: 'countries' }

let tableModel = { tableName: 'countries' }

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert (
      tableModel,
      [
        { Name: 'Netherlands', Capital: 'Amsterdam' },
        { Name: 'India', Capital: 'Delhi' },
        { Name: 'Italy', Capital: 'Milan' }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete (tableModel, null, {})
  }
};
