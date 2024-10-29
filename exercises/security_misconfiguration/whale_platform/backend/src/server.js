"use strict"

const express = require("express")
const cors = require("cors")
const fs = require("node:fs")

/**
 * Data Access Object Configuration
 */

const dao = process.env.BACKEND_DAO == "database" ?
  require("./databaseDao") : require("./memoryDao")

if (process.env.BACKEND_DAO == "database") {
  if (!process.env.DATABASE_HOST || !process.env.DATABASE_PORT) {
    console.error('No host/port specified in DATABASE_HOST/DATABASE_PORT')
    process.exit(1)
  }

  // NOTE: This is global, which is not recommended in production
  let password = "123"
  try {
    password = fs.readFileSync(process.env.DATABASE_PASSWORD_FILE, 'utf8')
  } catch(err) {
    console.info('No DB password in password file or no password file specified. Using default password.')
  }

  dao.configure({
    user:     "postgres",
    password: password,
    host:     process.env.DATABASE_HOST,
    port:     process.env.DATABASE_PORT
  })
}

// App Constants
const APP_PORT = 8080
const APP_HOST = "0.0.0.0"

let app

function configureEndpoints(app)
{
  console.info('Configuring endpoints') //TODO - Networking: Uncomment this line of logging
  app.get("/whales/random", async (req, res) => {
    const whales = await dao.getAllWhales()
    const randomWhale = whales[Math.floor(Math.random() * whales.length)]
    res.send(randomWhale)
  })

  app.post("/whales", async (req, res) => {
    const whale = req.body.whale_name
    await dao.addWhale(whale)
    res.send(whale)
  })

  app.get("/whales", async (req, res) => {
    const whales = await dao.getAllWhales()
    res.send(whales)
  })
}

async function startServer() {
  //Start DAO (Data Access Object)
  await dao.start()

  // App
  app = express()
  app.use(cors())
  app.use(express.json())

  configureEndpoints(app)

  let server = app.listen(APP_PORT, APP_HOST)
  console.info(`Listening on port ${APP_PORT}`)

  let shutdownHandler = handleShutdown.bind(this, server)
  process.on("SIGINT", shutdownHandler)
  process.on("SIGTERM", shutdownHandler)
  process.on("SIGHUP", shutdownHandler)
}

async function handleShutdown(server) {
  console.log("Waiting for DAO stop.")
  await dao.stop()

  console.info("Stopping server")
  server.close(() => {
    console.info("Server stopped - exiting...")
    process.exit(0)
  })
}

//Start the server
startServer()
