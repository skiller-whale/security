const express = require('express')

const app = express()
const port = 8003
app.use(express.json())

// read configuration files
var fs = require('fs')

var accessControl = 'allowlist';
// var accessControl = 'blocklist';
var allWhales = [
    'Humpback Whale',
    'Orca',
    'Blue Whale'
];

function requireAccess(type, path) {
    return function(req, res, next) {
        if (!req.accessToken) {
            return res.status(403).json({'error': 'Forbidden.'})
        }

        var token = req.accessToken;
        var tokensRoles = JSON.parse(fs.readFileSync('acl/tokens.json', 'utf8'))

        if (!tokensRoles[token]) {
            return res.status(403).json({'error': 'Invalid Token.'})
        }

        const accessKey = `${type} ${path}`
        const roles = tokensRoles[token]['roles']
        var allowed = false

        if (accessControl == 'allowlist') {
            var allowList = JSON.parse(fs.readFileSync('acl/allowlist.json', 'utf8'))
            const allowedRoles = allowList[accessKey]
            for (const role of roles) {
                if (allowedRoles.includes(role)) {
                    allowed = true
                    break
                }
            }
        } else if (accessControl == 'blocklist') {
            var blockList = JSON.parse(fs.readFileSync('acl/blocklist.json', 'utf8'))
            const blockedRoles = blockList[accessKey]
            
            allowed = true
            for (const role of roles) {
                if (blockedRoles.includes(role)) {
                    allowed = false
                    break
                }
            }
        }

        if (allowed) {
            console.log(`Access granted to '${accessKey}' for ${token}.`)
            next()
        } else {
            return res.status(403).json({'error': 'Forbidden.'})
        }
    }
}

// app.use((err, req, res, next) => {
//     if (err) {
//         // Errors are 404s
//         return res.sendStatus(404);
//     }
//     next();
// });

// bearer token middleware
app.use(function(req, res, next) {

    if (!req.headers.authorization) {
        return res.status(403).json({'error': 'No access token.'})
    }

    const header = req.headers.authorization.split(' ')

    if (header.length != 2 || header[0] != 'Bearer') {
        return res.status(400).json({'error': 'Malformed header.'})
    }
    
    req.accessToken = header[1]
    next()
});

app.get('/', (req, res) => {
    res.send(404)
})

app.get('/whales', requireAccess('GET', '/whales'), (req, res) => {
    res.send({
        'whales': allWhales
    })
})

app.post('/whales', requireAccess('POST', '/whales'), (req, res) => {
    if (!('whale' in req.body)) {
        res.status(400)
        res.send({'error': 'No whale specified'})
    } else { 
        allWhales.push(req.body.whale)
        res.sendStatus(200)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
