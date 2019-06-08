'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => {
      return queryInterface.createTable(
        'replies',
        {
          tweep_id: {
            type: Sequelize.UUID,
            foreignKey: true,
            allowNull: false
          },
          replier_user_id: {
            type: Sequelize.UUID,
            foreignKey: true,
            allowNull: false
          },
          content: {
            type: Sequelize.STRING,
            allowNull: false
          },
          date_created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal(`NOW()`),
            allowNull: false
          },
        }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('replies')
  }
};