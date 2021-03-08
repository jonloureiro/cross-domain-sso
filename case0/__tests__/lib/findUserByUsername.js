/* eslint-env jest */

const crypto = require('crypto')

const findUserByUsername = require('../../lib/findUserByUsername')
const getMongoClient = require('../../lib/getMongoClient')

let mongoClient

beforeAll(async () => {
  mongoClient = await getMongoClient({ serverSelectionTimeoutMS: 1000 })
})

afterAll(async () => {
  mongoClient.close()
})

test('Find an existing user', async () => {
  const username = crypto.randomBytes(20).toString('hex')
  const mockUser = { _id: 'test', username, password: '2' }
  await mongoClient
    .db('cross-domain-sso')
    .collection('users')
    .insertOne(mockUser)

  const result = await findUserByUsername(mongoClient, username)
  expect(result).toEqual(mockUser)

  await mongoClient
    .db('cross-domain-sso')
    .collection('users')
    .deleteOne(mockUser)
})

test('Do not find an existing user', async () => {
  const username = crypto.randomBytes(20).toString('hex')
  const result = await findUserByUsername(mongoClient, username)
  expect(result).toBeFalsy()
})
