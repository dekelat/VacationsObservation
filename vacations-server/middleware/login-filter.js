const expressJwt = require('express-jwt');
const config = require("../config.json");

let { secret } = config;

function authenticateJwtRequestToken() {
    return expressJwt({secret, algorithms: ['HS256']}).unless({
        path: [
            '/users/login',
            '/users/'
        ]
    })
}

module.exports = authenticateJwtRequestToken;