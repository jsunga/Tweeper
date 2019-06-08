'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => {
      return queryInterface.createTable(
        'following',
        {
          user_id: {
            type: Sequelize.UUID,
            foreignKey: true,
            allowNull: false
          },
          following_user_id: {
            type: Sequelize.UUID,
            foreignKey: true,
            allowNull: false
          },
        }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('following')
  }
};