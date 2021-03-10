/* eslint-env jest */

const crypto = require('crypto')

const createSession = require('../../lib/createSession')
const getMongoClient = require('../../lib/getMongoClient')
const invalidateSession = require('../../lib/invalidateSession')

let mongoClient
let mockUser

beforeAll(async () => {
  mongoClient = await getMongoClient({ serverSelectionTimeoutMS: 1000 })
})

afterAll(async () => {
  await (await getMongoClient()).close()
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
  const { refreshToken, expiresIn } = await createSession(mockUser._id)

  const session = await mongoClient
    .db('cross-domain-sso')
    .collection('sessions')
    .findOne({ createBy: mockUser._id })

  const token = await mongoClient
    .db('cross-domain-sso')
    .collection('tokens')
    .findOne({ sessionId: session._id })

  expect(refreshToken).toBe(token.refreshToken)
  expect(expiresIn.toString()).toBe(token.expiresIn.toString())
})

test('Invalidate session', async () => {
  const { refreshToken, expiresIn } = await createSession(mockUser._id)
  await invalidateSession(refreshToken)

  const token = await mongoClient
    .db('cross-domain-sso')
    .collection('tokens')
    .findOne({ refreshToken })

  const session = await mongoClient
    .db('cross-domain-sso')
    .collection('sessions')
    .findOne({ _id: token.sessionId })

  function timestamp (date) {
    return (new Date(date)).getTime()
  }

  expect(timestamp(expiresIn)).toBeGreaterThan(timestamp(token.expiresIn))
  expect(timestamp(expiresIn)).toBeGreaterThan(timestamp(session.expiresIn))
  expect(Date.now()).toBeGreaterThan(timestamp(token.expiresIn))
  expect(Date.now()).toBeGreaterThan(timestamp(session.expiresIn))
})
