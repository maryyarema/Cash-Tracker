"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable("expenses", {
        id: {
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        user_id: {
          allowNull: false,
          type: Sequelize.DataTypes.UUID,
          references: {
            key: "id",
            model: "users",
          },
          onUpdate: "RESTRICT",
          onDelete: "RESTRICT",
        },
        category_id: {
          allowNull: false,
          type: Sequelize.DataTypes.UUID,
          references: {
            key: "id",
            model: "expense_categories",
          },
          onUpdate: "RESTRICT",
          onDelete: "RESTRICT",
        },
        description: {
          allowNull: true,
          type: Sequelize.DataTypes.STRING,
        },
        amount: {
          allowNull: false,
          type: Sequelize.DataTypes.DECIMAL,
        },
        date: {
          allowNull: false,
          type: Sequelize.DataTypes.DATE,
        },
        type: {
          allowNull: false,
          type: Sequelize.DataTypes.ENUM("cash", "card"),
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
      throw new Error("[UP]: ERROR CREATING expenses TABLE.");
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.dropTable("expenses");
    } catch (error) {
      console.error(error);
      throw new Error("[DOWN]: ERROR DROPPING expenses TABLE.");
    }
  },
};
