let usersLogic = require("../logic/users-logic");
const express = require("express");

const router = express.Router();

// LOGIN
// POST http://localhost:3001/users/login
router.post("/login", async (request, response, next) => {
    let loginDetails = request.body;

    try {
        let successfulLoginData = await usersLogic.login(loginDetails);
        response.json(successfulLoginData);
    }
    catch (error) {
        return next(error); 
    }
});

// ADD USER (REGISTER)
// POST http://localhost:3001/users/
router.post("/", async (request, response, next) => {
    let user = request.body;

    try {
        await usersLogic.addUser(user);
        response.json();
    }
    catch (error) {
        return next(error);
    }
});

module.exports = router;