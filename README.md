# gsg-boilerplate-typescript

This project is a boilerplate to quickly get started with graphql-sequelize-generator on a Typescript project.

It's a To Do list app that allows you to manage tasks (create, update, delete, count).

## Getting Started

First you need to clone the project.

```
$ git clone https://github.com/teamstarter/gsg-boilerplate-typescript.git

or

git clone git@github.com:teamstarter/gsg-boilerplate-typescript.git
```

Then install all the dependencies of the project

```
$ yarn add
```

Then you need to initialize the database. It's a sqlite database as described in ./config/config.json. The following command will create or replace the ./data/database.sqlite and run the migrations and the seeds.

```
$ yarn db-reset
```

Once the database is initialized, you can run the project

```
$ yarn dev
```

The app is running on http://locahost:3000. You can test it

## The Server

It is a node server written in Typescript. The server generates a GraphQL schema. It only declares basic queries and subscriptions to keep it simple.

```typescript
graphqlSchemaDeclaration.task = {
  model: models.task,
  actions: ['list', 'create', 'update', 'delete', 'count'],
  subscriptions: ['create', 'update', 'delete'],
}
```

The schema uses the task model (in the models folder)

```typescript
export default function Task(sequelize: any) {
  var Task = sequelize.define(
    'task',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'task',
      paranoid: true,
      timestamps: true,
    }
  )

  return Task
}
```

The server gives an endpoint (/graphql) to execute get queries from the app.

## The App

It is a React app initialized using create-react-app. This boilerplate uses Typescript.

The app uses apollo (the @apollo/client package). The apollo client is created in the ./src/graphql/client.ts file.

We can send queries to the server to get or send data. In the following example, the query gets the lsit of tasks.

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

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
The `yarn dev` command runs the app and the server with pm2.

### `yarn db-reset`

creates a sqlite database file in the data folder and runs the migrations ans seeds. If the database file already exists the file is replaced by a new one. This command is useful to clean the database and get a default one.

### `pm2 log`

Use this command to print logs in the terminal. It's useful to have some realtime logs when you need to debug your app.

## Learn More

You can learn more about graphql-sequelize-generator [here](https://github.com/teamstarter/graphql-sequelize-generator).

To learn React, check out the [React documentation](https://reactjs.org/).
