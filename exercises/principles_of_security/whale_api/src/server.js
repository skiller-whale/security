const express = require('express')

const app = express()
const port = 8003
app.use(express.json())

// read configuration files
var fs = require('fs')

// var accessControl = 'allowlist';
var accessControl = 'denylist';
var allWhales = [
    'Humpback Whale',
    'Orca',
    'Blue Whale'
];

/**
 *
 * @param {String} type [Type of request - GET/POST]
 * @param {String} path [URL Path]
 * @returns [Either `next()` if access is granted or appropriate response.]
 */
function requireAccess(type, path) {
    return function(req, res, next) {
        // If `accessToken` is undefined, Forbidden (by default).
        if (!req.accessToken)
            return res.status(403).json({'error': 'Forbidden.'})

        var token = req.accessToken;
        var tokensRoles = JSON.parse(fs.readFileSync('acl/tokens.json', 'utf8'))

        // If the token isn't in `tokensRoles`, return 403.
        if (!tokensRoles.hasOwnProperty(token)) {
            return res.status(403).json({'error': 'Invalid Token.'})
        }

        const accessKey = `${type} ${path}`
        // Get the roles from the token.
        const roles = tokensRoles[token]['roles']
        var allowed = true

        if (accessControl == 'allowlist') {
            // For allowlists, check if any role is in the allowlist.
            var allowList = JSON.parse(fs.readFileSync('acl/allowlist.json', 'utf8'))
            const allowedRoles = allowList[accessKey]
            for (const role of roles) {
                if (allowedRoles.includes(role)) {
                    allowed = true
                    break
                }
            }
        } else if (accessControl == 'denylist') {
            // For a denylsit, check if no role is in the denylist.
            var denyList = JSON.parse(fs.readFileSync('acl/denylist.json', 'utf8'))
            const deniedRoles = denyList[accessKey]

            allowed = true
            for (const role of roles) {
                if (deniedRoles.includes(role)) {
                    allowed = false
                    break
                }
            }
        }

        if (allowed) {
            console.log(`Access granted to '${accessKey}' for ${token}.`)
            return next()
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
