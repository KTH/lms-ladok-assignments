require('dotenv').config()
const app = require('kth-node-server')
const logger = require('./logger')

const expressGraphql = require('express-graphql')
const { buildSchema } = require('graphql')

async function createLadokAssignments () {
  return false
}

// GraphQL schema
var schema = buildSchema(`
    type Query {
        course: Course
    },
    type Mutation {
      createLadokAssignments(course: Course!): Boolean
    }
    type Course {
        id: Int!
        sisCourseId: String!
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
