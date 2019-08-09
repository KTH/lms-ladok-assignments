const got = require('got')

async function run (canvasCourseId, sisCourseId) {
  const res = await got('http://localhost:3002/graphql', {
    method: 'POST',
    json: true,
    body: { query: `
    mutation{
      createLadokAssignments(id:${canvasCourseId}, sisCourseId: "${sisCourseId}")
    }`
    }
  })
  console.log(res.body)
}
run(3719, 'A11HIBHT171')
