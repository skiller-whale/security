const assert = require('node:assert')
const { describe, it, test, before, beforeEach, afterEach, after } = require('node:test')
const databaseDao = require('../src/databaseDao')

describe('tests', async () => {
    // can't do an 'await' here as there is a node 
    let initialWhales;

    before(async () => {
        // setup
        //  save the initial whales before running tests
        databaseDao.configure({
            user:     "postgres",
            password: "123",
            host:     process.env.DATABASE_HOST,
            port:     process.env.DATABASE_PORT
        })
        
        await databaseDao.start()
            .then(databaseDao.resetWhales)
            .then(databaseDao.getAllWhales)
            .then((whales) => {
                initialWhales = [...whales]
            })
    })

    after(databaseDao.stop.bind(databaseDao));

    it('tests addWhale', async () => {
        await databaseDao.resetWhales()
        await databaseDao.addWhale('test_whale_1')
        let expected_whales = [...initialWhales, 'test_whale_1']
        
        all_whales = await databaseDao.getAllWhales()
        assert.deepEqual(all_whales, expected_whales)
    });

    it('tests resetWhales', async () => {
        await databaseDao.addWhale('test_whale_1')
        await databaseDao.resetWhales()

        all_whales = await databaseDao.getAllWhales()
        assert.deepEqual(all_whales, initialWhales)
    })
});
