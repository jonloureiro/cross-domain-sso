/* eslint-env jest */

const crypto = require('crypto')

const createRefreshToken = require('../../lib/createRefreshToken')
const getMongoClient = require('../../lib/getMongoClient')

let mongoClient
let mockUser

beforeAll(async () => {
  mongoClient = await getMongoClient({ serverSelectionTimeoutMS: 1000 })
})

afterAll(async () => {
  await mongoClient.close()
})

beforeEach(async () => {
  mockUser = {
    username: crypto.randomBytes(8).toString('hex'),
    password: crypto.randomBytes(8).toString('hex')
  }
  const { insertedId } = await mongoClient
    .db('cross-domain-sso')
    .collection('users')
    .insertOne(mockUser)
  mockUser._id = insertedId
})

afterEach(async () => {
  await mongoClient
    .db('cross-domain-sso')
    .collection('users')
    .deleteOne({ _id: mockUser._id })
})

test('Create a refresh token', async () => {
  const { refreshToken, expiresIn } = await createRefreshToken(mockUser._id)

  const session = await mongoClient
    .db('cross-domain-sso')
    .collection('sessions')
    .findOne({ createBy: mockUser._id })

  const token = await mongoClient
    .db('cross-domain-sso')
    .collection('tokens')
    .findOne({ sessionId: session._id })

  expect(refreshToken).toBe(token.refreshToken)
  expect(expiresIn).toBe(token.expiresIn)
})
