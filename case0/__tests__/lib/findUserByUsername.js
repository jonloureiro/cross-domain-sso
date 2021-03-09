/* eslint-env jest */

const crypto = require('crypto')

const findUserByUsername = require('../../lib/findUserByUsername')
const getMongoClient = require('../../lib/getMongoClient')

let mongoClient

beforeAll(async () => {
  mongoClient = await getMongoClient({ serverSelectionTimeoutMS: 1000 })
})

afterAll(async () => {
  await mongoClient.close()
})

test('Find an existing user', async () => {
  const mockUser = {
    username: crypto.randomBytes(8).toString('hex'),
    password: crypto.randomBytes(8).toString('hex')
  }
  const { insertedId } = await mongoClient
    .db('cross-domain-sso')
    .collection('users')
    .insertOne(mockUser)

  const result = await findUserByUsername(mockUser.username)
  expect(result).toEqual(mockUser)

  await mongoClient
    .db('cross-domain-sso')
    .collection('users')
    .deleteOne({ _id: insertedId })
})

test('Do not find an existing user', async () => {
  const username = crypto.randomBytes(8).toString('hex')
  const result = await findUserByUsername(username)
  expect(result).toBeFalsy()
})
