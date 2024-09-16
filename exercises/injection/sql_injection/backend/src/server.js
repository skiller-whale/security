import pg from 'pg'
import express from 'express'

const app = express()
const port = 3000

const { Client } = pg
let client = null

app.use(express.static("public"))


app.get('/basket', async (req, res, next) => {
  try {
    const code = req.query.code
    const lineItems = [
        {description: "Fish Food, 500g tin", quantity: 2, total: 25},
        {description: "Aquarium, 100L", quantity: 1, total: 100},
        {description: "Goldfish", quantity: 2, total: 30}
      ]
    const total = lineItems.reduce((total, li) => total + li.total, 0 )

    let error = undefined
    let appliedDiscount = undefined

    if(code){
      if(!client) await connect()
      let result = null

      try {
        result = await client.query(`SELECT * from promo_codes where code='${code}' LIMIT 1`)
      }
      catch(err) {
        err.message += `\nHINT: ${err.hint}`
        throw err
      }
      if(result.rowCount === 0 ){
        error = `Unknown code ${code}`
      }
      else {
        const discountData = result.rows[0]
        const discount = Math.round((total * discountData.discountpct)/100.0)
        appliedDiscount ={
          code: code,
          discount,
          total: total - discount
        }
      }
    }

    res.json({
      lineItems,
      error,
      total,
      appliedDiscount
    })
  }
  catch( err){
    next(err)
  }
})

const connect = async () => {
  client = new Client()
  await client.connect()
}

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() =>  process.exit())
})
