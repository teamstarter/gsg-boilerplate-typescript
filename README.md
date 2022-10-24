# gsg-boilerplate-typescript

This project is a boilerplate to quickly get started with graphql-sequelize-generator on a Typescript project.

It's a simple To Do list app based on [this codepen](https://codepen.io/karlomajer/pen/rvyyvV) that allows you to manage tasks (create, update, delete, count).

## Getting Started

First you need to clone the project.

```
$ git clone git@github.com:teamstarter/gsg-boilerplate-typescript.git
```

This project uses the 12.18.1 version of Node. You can switch to the right version using nvm. Install nvm if you don't have it

```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash
```

Then choose the rigth version

```
$ nvm use
```

Then install all the dependencies of the project

```
$ yarn
```

Then you need to initialize the database before starting the project. It is configured by default with an sqlite database as described in ./config/config.json. The following command will create or replace the ./data/database.sqlite and run the migrations and the seeds.

You can use any [Sequelize](https://sequelize.org/master/manual/getting-started.html)-compatible database (Postgresql, MySQL, etc...), but the project will work with the default one without any problem.

```
$ yarn db-reset
```

Once the database is initialized, you can run the project

```
$ yarn dev
```

You can then test the app at this address: [http://locahost:3000](http://locahost:3000) and the GraphQL dashboard at this URL: [http://localhost:8080/graphql](http://localhost:8080/graphql).

## The Server

It's a node server written in Typescript. It generates a GraphQL schema based on a few declarations of queries, mutations and subscriptions.

```typescript
graphqlSchemaDeclaration.task = {
  model: models.task,
  actions: ['list', 'create', 'update', 'delete', 'count'],
  subscriptions: ['create', 'update', 'delete']
}
```

GSG requires a task model (in the models folder), to work with the above configuration.

```typescript
export default function Task(sequelize: any) {
  var Task = sequelize.define(
    'task',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'task',
      paranoid: true,
      timestamps: true
    }
  )

  return Task
}
```

The server generates an endpoint (/graphql) to execute get/post queries from the app.

## The App

This boilerplace uses React. It was initialized using create-react-app in Typescript.

The app uses apollo (the @apollo/client package) which allows you
to quickly send queries to the server to get or send data. In the following example, the query gets a list of tasks.

```typescript
const GET_TASKS = gql`
  query GetTasks($order: String, $where: SequelizeJSON) {
    task(order: $order, where: $where) {
      id
      name
      active
    }
  }
```

## How to add a field?

Look at the "migrations" folder, duplicate the last migration, change the timestamp and add your field(s).
Add the field in the models/task.ts file.
And run **yarn db-migrate**, and that's it! The field will be available on the GraphQL object after pm2 reloads the server.

## Available Commands

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser while reloading if you make edits.

A dashboard is also available to test your GraphQL schema at this URL: [http://localhost:8080/graphql](http://localhost:8080/graphql).

The `yarn dev` command runs the app and the server with pm2.

### `yarn db-reset`

Creates a sqlite database file in the data folder and runs the migrations and seeds. If the database file already exists the file is replaced by a new one. This command is useful to clean the database and get a default one.

### `yarn db-migrate`

Run the migration in the "migrations" folder if they have not yet been successfully migrated.
For more information on how the sequelize migrations works, check [here](https://sequelize.org/docs/v6/other-topics/migrations/).

### `./node_modules/.bin/pm2 log`

Use this command to print logs in the terminal. It's useful to have some realtime logs when you need to debug your app.

### `./node_modules/.bin/pm2 delete all`

This command will stop your app.

## Learn More

You can learn more about graphql-sequelize-generator [here](https://teamstarter.github.io/gsg-documentation/).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn Typescript, check out the [Typescript documentation](https://www.typescriptlang.org/)

To learn Graphql, check out the [GraphQL documentation](https://graphql.org/)

You can learn more about pm2 [here](https://pm2.keymetrics.io/)
