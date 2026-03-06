'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * An Activity belongs to one Application.
     */
    static associate(models) {
      Activity.belongsTo(models.Application, {
        foreignKey: 'application_id',
        as: 'application',
      });
    }
  }

  Activity.init(
    {
      application_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('Email', 'Call', 'Interview', 'Note'),
        allowNull: false,
      },
      occurred_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      summary: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Activity',
      tableName: 'Activities',
      underscored: true,
    }
  );

  return Activity;
};
