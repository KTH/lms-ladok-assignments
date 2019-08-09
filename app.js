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
        id: Int!
    },
    type Mutation {
      createLadokAssignments(id: Int! , sisCourseId: String!): Boolean
    }
`)

app.use('/api/lms-sync-courses/', require('./systemroutes'))

app.use('/graphql', expressGraphql({
  schema: schema,
  rootValue: {
    createLadokAssignments
  },
  graphiql: true
}))

app.start({
  port: 3000,
  logger
})
