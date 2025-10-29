const express = require('express')
const cors = require("cors")

const app = express()

const APP_PORT = 8080
const APP_HOST = "0.0.0.0"

app.use(cors())
app.use(express.json())

var allowedTokens = {
    'christian_whale_token': ['christian_whale'],
    'dev_user_token': ['dev_user'],
    'admin_user_token': ['admin_user']
}

var boards = {
    "christian_whale": {
        "name": "Christian's Board",
        "tickets": ["Learn how to do project management."]
    },
    "dev_user": {
        "name": "Dev User Board",
        "tickets": [
            "Fire Christian Whale for poor performance."
        ]
    },
    "admin_user": {
        "name": "Admin Board",
        "tickets": [
            "The default admin password is 'drowssap', change on login."
        ]
    }
}

// bearer token middleware
app.use(function(req, res, next) {

    if (!req.headers.authorization)
        return res.status(403).json({'error': 'No access token.'})

    const header = req.headers.authorization.split(' ')

    if (header.length != 2 || header[0] != 'Bearer')
        return res.status(400).json({'error': 'Malformed header.'})

    req.accessToken = header[1]

    if (!allowedTokens.hasOwnProperty(req.accessToken))
        return res.status(403).json({'error': 'Forbidden.'})

    req.user = allowedTokens[req.accessToken]

    next()
});

app.get('/', (req, res) => {
    return res.send(404)
})

app.get('/boards', (req, res) => {
    if (!boards.hasOwnProperty(req.user))
        return res.status(403).json({'error': 'Forbidden'})

    return res.send(boards[req.user])
})

app.get('/tickets', (req, res) => {
    var tickets = []

    for (const [_, board] of Object.entries(boards))
        tickets = [...tickets, ...board['tickets']]

    return res.send(tickets)
})

app.post('/tickets', (req, res) => {
    if (!boards.hasOwnProperty(req.user))
        return res.status(403).json({'error': 'Forbidden'}
    )

    // NOTE: Validation of `req.body` would go here in a real application.

    boards[req.user]['tickets'] = [
        ...boards[req.user]['tickets'],
        ...req.body.tickets
    ]
    return res.sendStatus(200)
})

app.listen(APP_PORT, APP_HOST, () => {
    console.log(`Listening on port ${APP_HOST}/${APP_PORT}`)
})
