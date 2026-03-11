'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Applications', 'is_archived', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('Applications', 'archived_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Applications', 'archive_reason', {
      type: Sequelize.ENUM(
        'Rejected',
        'Offer Declined',
        'Withdrawn',
        'Position Closed'
      ),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Applications', 'archive_reason');
    await queryInterface.removeColumn('Applications', 'archived_at');
    await queryInterface.removeColumn('Applications', 'is_archived');
  },
};
