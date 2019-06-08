'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => {
      return queryInterface.createTable(
        'tweeps',
        {
          tweep_id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            allowNull: false
          },
          user_id: {
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
          total_replies: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
          },
          total_likes: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
          },
          total_retweeps: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
          },
        }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tweeps')
  }
};