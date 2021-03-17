const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");
let usersDao = require("../dao/users-dao");
let cache = require("../controllers/cache-controller");

const RIGHT_SALT = "ksdjfhbAWEDCAS29!@$addlkmn";
const LEFT_SALT = "32577098ASFKJkjsdhfk#$dc";

async function login(loginDetails) {

    if (loginDetails.userName == null || loginDetails.password == null){
        throw new ServerError(ErrorType.MISSING_REQUIRED_FIELDS);
    }

    loginDetails.password = crypto.createHash("md5").update(
        LEFT_SALT + loginDetails.password + RIGHT_SALT).digest("hex");
    let userData = await usersDao.login(loginDetails);
    let saltedUserName = LEFT_SALT + userData.userName + RIGHT_SALT;
    const token = jwt.sign({ sub: saltedUserName }, config.secret);

    cache.put(token, userData);
    let response = { token: "Bearer " + token, userType: userData.userType };
    return response;
}

async function addUser(user) {

    if (user.userName == null || user.password == null || user.type == null){
        throw new ServerError(ErrorType.MISSING_REQUIRED_FIELDS);
    }

    // Validate user name doesn't exist
    if (await usersDao.isUserExistByName(user.userName)) {
        throw new ServerError(ErrorType.USER_NAME_ALREADY_EXIST);
    }

    user.password = crypto.createHash("md5").update(
        LEFT_SALT + user.password + RIGHT_SALT).digest("hex");
    await usersDao.addUser(user);
}

// function emailIsValid (email) {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
// }

module.exports = {
    login,
    addUser
};