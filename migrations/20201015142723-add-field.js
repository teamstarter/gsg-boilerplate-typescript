module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('task', 'color', {
      type: Sequelize.DataTypes.STRING
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('task', 'color')
  }
}
