'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => {
      return queryInterface.createTable(
        'messages',
        {
          message_id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            allowNull: false
          },
          owner_id: {
            type: Sequelize.UUID,
            foreignKey: true,
            allowNull: false
          },
          message: {
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
    return queryInterface.dropTable('messages')
  }
};