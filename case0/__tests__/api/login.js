const { handler } = require('../../api/login')

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

describe('/api/login', () => {
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
      expect(response.statusCode).toBe(403)
    })
  })

  test('Invalid username or password', async () => {
    const responses = await Promise.all([
      handler(stringifyBody({ ...request, body: { ...request.body, username: 'exampl' } })),
      handler(stringifyBody({ ...request, body: { ...request.body, password: '2' } }))
    ])
    responses.forEach((response) => {
      expect(response.statusCode).toBe(403)
    })
  })
})