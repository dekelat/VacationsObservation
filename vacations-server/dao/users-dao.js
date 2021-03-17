const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");
let connection = require("./connection-wrapper");

async function login(loginDetails) {
    let sql = `SELECT id, 
                    user_name as 'userName',
                    password,
                    first_name as 'firstName',
                    last_name as 'lastName',
                    user_type as 'userType'
                FROM users WHERE user_name =? and password = ?`;
    let parameters = [loginDetails.userName, loginDetails.password];
    let usersLoginResult;

    try {
        usersLoginResult = await connection.executeWithParameters(sql, parameters);
    }
    catch (error) {
        // TECHNICAL ERROR HAD OCCURED
        throw new ServerError(ErrorType.GENERAL_ERROR, JSON.stringify(user), error);
    }

    // A functional (!) issue which means - the userName + password do not match
    if (usersLoginResult == null || usersLoginResult.length == 0) {
        throw new ServerError(ErrorType.UNAUTHORIZED_LOGIN);
    }

    return usersLoginResult[0];
}

async function isUserExistByName(userName) {
    let sql = "SELECT * FROM users WHERE user_name =?";
    let parameters = [userName];
    let response;

    try {
        response = await connection.executeWithParameters(sql, parameters);

    } catch (error) {
        // TECHNICAL ERROR HAD OCCURED
        throw new ServerError(ErrorType.GENERAL_ERROR, userName, error);
    }

    if (response == null || response.length == 0) {
        return false;
    }

    return true;
}

async function addUser(user) {
    let sql = `INSERT INTO users (user_name, password, user_type, first_name, last_name)
                VALUES(?,?,?,?,?)`;
    let parameters = [user.userName, user.password, user.type, user.firstName, user.lastName];

    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
}

module.exports = {
    login,
    isUserExistByName,
    addUser
};