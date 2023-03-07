import { GraphqlSchemaDeclarationType } from 'graphql-sequelize-generator/types'

import {
  generateModelTypes,
  generateApolloServer
} from 'graphql-sequelize-generator'
import { WebSocketServer } from 'ws'
import { PubSub } from 'graphql-subscriptions'

import models from '../models'

const types = generateModelTypes(models)

let graphqlSchemaDeclaration: GraphqlSchemaDeclarationType = {}

graphqlSchemaDeclaration.task = {
  model: models.task,
  actions: ['list', 'create', 'update', 'delete', 'count'],
  subscriptions: ['create', 'update', 'delete']
}

const pubSubInstance = new PubSub()

module.exports = (globalPreCallback = () => null, httpServer: any) => {
  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql'
  })

  return {
    server: generateApolloServer({
      graphqlSchemaDeclaration,
      types,
      models,
      globalPreCallback,
      wsServer,
      apolloServerOptions: {
        // Required for the tests.
        csrfPrevention: false,
        playground: true
      },
      callWebhook: (data: any) => {
        return data
      },
      pubSubInstance
    })
  }
}
