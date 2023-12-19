module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('task', 'date', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('task', 'date')
  }
}
