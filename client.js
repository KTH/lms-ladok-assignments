const got = require('got')

async function run () {
  const res = await got('http://localhost:3000/graphql', {
    method: 'POST',
    json: true,
    body: { query: `
    mutation{
      createLadokAssignments(id:10001, sisCourseId: "aoe")
    }`
    }
  })
  console.log(res.body)
}
run()
