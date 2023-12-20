module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('task', 'reminderDate', { type: Sequelize.STRING });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('task', 'reminderDate');
  }
};
