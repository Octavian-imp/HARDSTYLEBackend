"use strict";

const status_order = require("../global/status_order");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("orders", "status", {
      type: Sequelize.ENUM(
        status_order.created,
        status_order.enRoute,
        status_order.completed,
        status_order.canceled
      ),
      allowNull: false,
      defaultValue: status_order.created,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("orders", "status");
  },
};
