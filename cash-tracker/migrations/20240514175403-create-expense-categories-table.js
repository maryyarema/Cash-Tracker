"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable("expense_categories", {
        id: {
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        name: {
          allowNull: false,
          type: Sequelize.DataTypes.STRING,
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

      await queryInterface.addConstraint("expense_categories", {
        fields: ["name", "user_id"],
        type: "unique",
        name: "expense_categories_name_user_id_unique_key",
      });
    } catch (error) {
      console.error(error);
      throw new Error("[UP]: ERROR CREATING expense_categories TABLE.");
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.removeConstraint(
        "expense_categories",
        "expense_categories_name_user_id_unique_key"
      );
      await queryInterface.dropTable("expense_categories");
    } catch (error) {
      console.error(error);
      throw new Error("[DOWN]: ERROR DROPPING expense_categories TABLE.");
    }
  },
};
