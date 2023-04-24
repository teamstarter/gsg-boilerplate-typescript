module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('task', 'memoDate', {
        allowNull: true,
        type: Sequelize.DataTypes.DATE
      }),
      queryInterface.addColumn('task', 'memoSent', {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      })
    ])
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('task', 'color'),
      queryInterface.removeColumn('task', 'color')
    ])
  }
}
