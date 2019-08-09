require('dotenv').config()
const app = require('kth-node-server')
const logger = require('./logger')

const expressGraphql = require('express-graphql')
const { buildSchema } = require('graphql')

// GraphQL schema
var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Mutation {
      createLadokAssignments(id: Int! , sisCourseId: String!): Boolean
    }
    type Course {
        id: Int
    }
`)

app.use('/api/lms-sync-courses/', require('./systemroutes'))

app.use('/graphql', expressGraphql({
  schema: schema,
  rootValue: {
    createLadokAssignments: ({ id, sisCourseId }) => {
      console.log('Helloooo!')
      return true
    }
  },
  graphiql: true
}))

app.start({
  port: 3000,
  logger
})
