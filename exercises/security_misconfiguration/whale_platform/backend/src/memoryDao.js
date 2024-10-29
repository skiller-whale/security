const initialWhales = [
    "Skiller Whale",
    "Blue Whale",
    "Christian Whale",
    "Minke Whale",
    "Grey Whale"
]

let currentWhales = []

async function start()
{
    console.info('Now storing whales in memory.')
    await this.resetWhales() //Need to initialize the whales every time we start the dao, as we're in memory.
}

async function getAllWhales()
{
    return currentWhales
}

async function resetWhales()
{
    return currentWhales = [...initialWhales]
}

async function addWhale(whale)
{
    return currentWhales.push(whale)
}

async function stop()
{
    console.log('No longer storing whales in memory.')
}

module.exports = {
    start, stop, getAllWhales, addWhale, resetWhales
}
