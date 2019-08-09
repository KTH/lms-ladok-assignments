const got = require('got')

async function run (sisCourseId) {
  const res = await got('http://localhost:3002/graphql', {
    method: 'POST',
    json: true,
    body: { query: `
    mutation{
      createLadokAssignments(sisCourseId: "${sisCourseId}")
    }`
    }
  })
  console.log(res.body)
}
run('A11HIBHT171')
