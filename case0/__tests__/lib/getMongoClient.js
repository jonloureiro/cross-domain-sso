/* eslint-env jest */

const getMongoClient = require('../../lib/getMongoClient')

test('Connection with mongodb', async () => {
  const promiseMongoClient = getMongoClient({ serverSelectionTimeoutMS: 1000 })
  await expect(promiseMongoClient).resolves.not.toThrow()
  await (await getMongoClient()).close()
})
