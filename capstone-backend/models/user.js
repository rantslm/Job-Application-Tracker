'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Define associations between models.
    // A User can have many Applications.
    static associate(models) {
      User.hasMany(models.Application, {
        foreignKey: 'user_id',
        as: 'applications',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  // Define the User model structure.
  // This represents an account that owns job applications.
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true,
    }
  );

  return User;
};
