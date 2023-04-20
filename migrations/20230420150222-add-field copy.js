module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('task', 'date', {
      type: Sequelize.DataTypes.INTEGER
    })
  }
}
