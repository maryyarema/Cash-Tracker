"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable("users", {
        id: {
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        email: {
          allowNull: false,
          type: Sequelize.DataTypes.STRING,
          unique: true,
        },
        name: {
          allowNull: false,
          type: Sequelize.DataTypes.STRING,
        },
        salt: {
          allowNull: false,
          type: Sequelize.DataTypes.STRING.BINARY,
        },
        password_hash: {
          allowNull: false,
          type: Sequelize.DataTypes.STRING.BINARY,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DataTypes.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DataTypes.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error("[UP]: ERROR CREATING users TABLE.");
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.dropTable("users");
    } catch (error) {
      console.error(error);
      throw new Error("[DOWN]: ERROR DROPPING users TABLE.");
    }
  },
};
