const got = require('got')

async function run (canvasCourseId, sisCourseId) {
  const res = await got('http://localhost:3000/graphql', {
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
run(8058, 'SE2134VT191')
