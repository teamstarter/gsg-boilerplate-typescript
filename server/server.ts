const express = require('express')
const { expressMiddleware } = require('@apollo/server/express4')
const http = require('http')
const cors = require('cors')
const { json } = require('body-parser')

const setupServer = require('./schema')

const createServer = async (options = {}, globalPreCallback = () => null) => {
  const app = express()
  options = {
    spdy: { plain: true },
    ...options
  }
  const httpServer = http.createServer(options, app)
  const { server } = setupServer(globalPreCallback, httpServer)
  await server.start()
  //server.applyMiddleware({ app, path: '/graphql' })
  app.use('/graphql', cors(), json(), expressMiddleware(server, {}))

  await new Promise(resolve => {
    httpServer.listen(process.env.PORT || 8080, () => {
      resolve()
    })

    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT || 8080}/graphql`
    )
  })
  return httpServer
}

createServer()
