require('dotenv').config()
const app = require('kth-node-server')
const logger = require('./logger')
const got = require('got')
const canvas = require('@kth/canvas-api')(process.env.CANVAS_API_URL, process.env.CANVAS_API_TOKEN)

const expressGraphql = require('express-graphql')
const { buildSchema } = require('graphql')

// TODO: some sort of auth? Signed secret perhaps?
async function createLadokAssignments ({ id, sisCourseId }) {
  console.log('create assignments for ', sisCourseId)
  const assignments = await canvas.list(`/courses/${id}/assignments`).toArray()

  const [, courseCode, term, year] = sisCourseId.match(/(.*)(VT|HT)(\d{2})\d/)

  const { body: courseDetails } = await got(`https://api.kth.se/api/kopps/v2/course/${courseCode}/detailedinformation`, { json: true })
  const termUtils = {
    VT: 1,
    HT: 2,
    1: 'VT',
    2: 'HT'
  }

  const gradingSchemas = {
    AF: 562,
    PF: 609
  }

  const termNumber = `20${year}${termUtils[term]}`
  const examinationSets = Object.values(courseDetails.examinationSets)
    .sort((a, b) => parseInt(a.startingTerm.term, 10) - parseInt(b.startingTerm.term, 10))
    .filter(e => parseInt(e.startingTerm.term, 10) <= termNumber)

  const examinationRounds = examinationSets[examinationSets.length - 1].examinationRounds
  console.log('examinationRounds in Ladok: ', examinationRounds)
  for (const examinationRound of examinationRounds) {
    const assignmentSisID = `${sisCourseId}_${examinationRound.examCode}`
    const assignment = assignments.find(a => a.integration_data.sis_assignment_id === assignmentSisID)

    const modulId = examinationRound.ladokUID

    const body = {
      assignment: {
        name: `LADOK - ${examinationRound.examCode} (${examinationRound.title})`,
        description: `Denna uppgift motsvarar Ladokmodul <strong>"${examinationRound.title}" (${examinationRound.examCode})</strong>.<br>Betygsunderlag i denna uppgift skickas till Ladok.`,
        muted: true,
        submission_types: ['none'],
        grading_type: 'letter_grade',
        grading_standard_id: gradingSchemas[examinationRound.gradeScaleCode],
        integration_id: modulId,
        integration_data: JSON.stringify({
          sis_assignment_id: assignmentSisID
        })
      }
    }

    if (!assignment) {
      await canvas.requestUrl(`courses/${id}/assignments/`, 'POST', body)
    } else if (modulId !== assignment.integration_id) {
      await canvas.requestUrl(`courses/${id}/assignments/${assignment.id}`, 'PUT', body)
    }
  }

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
  port: 3002,
  logger
})
