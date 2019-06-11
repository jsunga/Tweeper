'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => {
      return queryInterface.createTable(
        'likes',
        {
          tweep_id: {
            type: Sequelize.UUID,
            foreignKey: true,
            allowNull: false
          },
          liker_user_id: {
            type: Sequelize.UUID,
            foreignKey: true,
            allowNull: false
          },
        }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('likes')
  }
};