"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable("income_categories", {
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

      await queryInterface.addConstraint("income_categories", {
        fields: ["name", "user_id"],
        type: "unique",
        name: "income_categories_name_user_id_unique_key",
      });
    } catch (error) {
      console.error(error);
      throw new Error("[UP]: ERROR CREATING income_categories TABLE.");
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.removeConstraint(
        "income_categories",
        "income_categories_name_user_id_unique_key"
      );
      await queryInterface.dropTable("income_categories");
    } catch (error) {
      console.error(error);
      throw new Error("[DOWN]: ERROR DROPPING income_categories TABLE.");
    }
  },
};
