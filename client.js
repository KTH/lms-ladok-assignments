const got = require('got')

async function run () {
  const res = await got('http://localhost:3000/graphql', {
    method: 'POST',
    json: true,
    body: { query: '{ message }' }
  })
  console.log(res.body)
}
run()
