'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Applications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      company_name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      position_title: {
        type: Sequelize.STRING,
        allowNull: false
      },

      stage: {
        type: Sequelize.ENUM('Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'),
        allowNull: false,
        defaultValue: 'Saved'
      },

      job_url: {
        type: Sequelize.STRING,
        allowNull: true
      },

      location: {
        type: Sequelize.STRING,
        allowNull: true
      },

      salary_min: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      salary_max: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      applied_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Applications');
    // Important: remove ENUM type in MySQL to avoid migration issues later
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS enum_Applications_stage;");
  }
};
