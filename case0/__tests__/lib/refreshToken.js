/* eslint-env jest */

const crypto = require('crypto')

const createSession = require('../../lib/createSession')
const getMongoClient = require('../../lib/getMongoClient')
const refreshToken = require('../../lib/refreshToken')

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
    username: crypto.randomBytes(8).toString('hex')
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

test('Refresh token', async () => {
  const session = await createSession(mockUser._id)

  const dateNow = Date.now()
  const dateNowSpy = jest.spyOn(Date, 'now')
    .mockImplementation(() => (dateNow + 300000))

  const updatedSession = await refreshToken(session.refreshToken)

  dateNowSpy.mockRestore()

  function timestamp (date) {
    return (new Date(date)).getTime()
  }

  expect(timestamp(updatedSession.expiresIn)).toBeGreaterThan(timestamp(session.expiresIn))
  expect(session.refreshToken).not.toBe(updatedSession.refreshToken)
  expect(updatedSession.userId).toStrictEqual(mockUser._id)
})
