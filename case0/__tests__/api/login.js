/* eslint-env jest */

const { handler } = require('../../api/login')

jest.mock('../../lib/findUserByUsername')
jest.mock('../../lib/getMongoClient')
jest.mock('../../lib/createRefreshToken')

const request = {
  httpMethod: 'POST',
  body: {
    username: 'example',
    password: '1'
  }
}

const stringifyBody = function (request) {
  return {
    ...request,
    body: JSON.stringify(request.body)
  }
}

test('Methods not allowed', async () => {
  const responses = await Promise.all([
    handler({ httpMethod: 'GET' }),
    handler({ httpMethod: 'PUT' }),
    handler({ httpMethod: 'DELETE' })
  ])
  responses.forEach((response) => {
    expect(response.statusCode).toBe(405)
  })
})

test('Username or password not provided', async () => {
  const responses = await Promise.all([
    handler(stringifyBody({ ...request, body: undefined })),
    handler(stringifyBody({ ...request, body: { username: undefined } })),
    handler(stringifyBody({ ...request, body: { password: undefined } }))
  ])
  responses.forEach((response) => {
    expect(response.statusCode).toBe(401)
  })
})

test('Invalid username or password', async () => {
  const responses = await Promise.all([
    handler(stringifyBody({ ...request, body: { ...request.body, username: 'exampl' } })),
    handler(stringifyBody({ ...request, body: { ...request.body, password: '2' } }))
  ])
  responses.forEach((response) => {
    expect(response.statusCode).toBe(401)
  })
})

test('Valid credentials', async () => {
  const responses = await Promise.all([
    handler(stringifyBody({ ...request }))
  ])
  responses.forEach((response) => {
    expect(response.statusCode).toBe(200)
    expect(response.headers).toHaveProperty('Set-Cookie')
    expect(JSON.parse(response.body)).toHaveProperty('access_token')
  })
})
