require('dotenv').config()
const app = require('kth-node-server')
const logger = require('./logger')

const expressGraphql = require('express-graphql')
const { buildSchema } = require('graphql')

async function createLadokAssignments ({ id, sisCourseId }) {
  console.log(id, sisCourseId)
  return false
}

// GraphQL schema
var schema = buildSchema(`
    type Query {
      message: String
    },
    type Mutation {
      createLadokAssignments(id: Int! , sisCourseId: String!): Boolean
    }
`)

app.use('/api/lms-sync-courses/', require('./systemroutes'))

app.use('/graphql', expressGraphql({
  schema: schema,
  rootValue: {
    createLadokAssignments,
    message: () => 'Hello World!'
  },
  graphiql: true
}))

app.start({
  port: 3000,
  logger
})
