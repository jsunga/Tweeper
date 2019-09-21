'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => {
      return queryInterface.createTable(
        'users',
        {
          user_id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            allowNull: false
          },
          username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
          },
          firstname: {
            type: Sequelize.STRING,
            allowNull: false
          },
          lastname: {
            type: Sequelize.STRING,
            allowNull: false
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false
          },
          date_created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal(`NOW()`),
            allowNull: false
          },
          image_url: {
            type: Sequelize.STRING,
            defaultValue: 'http://localhost:5000/api/assets/avatar.png',
            allowNull: false
          },
          followers: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
          },
          following: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
          },
          tweeps: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
          },
        }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users')
  }
}