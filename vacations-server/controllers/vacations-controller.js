const express = require("express");
const vacationsLogic = require("../logic/vacations-logic");
const cache = require("../controllers/cache-controller");

const router = express.Router();

// GET VACATIONS
// GET http://localhost:3001/vacations/
// router.get("/", async (request, response, next)=>{
//     try {
//         let vacationsData = await vacationsLogic.getAllVacations();
//         response.json(vacationsData);
//     }
//     catch (error) {
//         return next(error);
//     }
// });

// GET VACATIONS FOR LOGGED IN USER
// GET http://localhost:3001/vacations/
router.get("/", async (request, response, next) => {
    let userId = cache.extractUserDataFromCache(request).id;
    try {
        let vacationsData = await vacationsLogic.getAllVacationsForUser(userId);
        response.json(vacationsData);
    }
    catch (error) {
        return next(error);
    }
});

// ADD VACATION
// POST http://localhost:3001/vacations/
router.post("/", async (request, response, next) => {
    let userData = cache.extractUserDataFromCache(request);
    let vacation = request.body;
    try {
        await vacationsLogic.addVacation(userData.id, userData.userType, vacation);
        response.json();
    }
    catch (error) {
        return next(error);
    }
});

// UPDATE VACATION
// PUT http://localhost:3001/vacations/
router.put("/", async (request, response, next) => {
    let userData = cache.extractUserDataFromCache(request);
    let vacation = request.body;
    try {
        await vacationsLogic.updateVacation(userData.id, userData.userType, vacation);
        response.json();
    }
    catch (error) {
        return next(error);
    }
});

// DELETE VACATION
// DELETE http://localhost:3000/vacations/:id
router.delete("/:id", async (request, response, next) => {
    let userData = cache.extractUserDataFromCache(request);
    let vacationId = request.params.id;
    try {
        await vacationsLogic.deleteVacation(userData.userType, userData.userId, vacationId);
        response.json();
    }
    catch (error) {
        return next(error);
    }
});

// FOLLOW VACATION
// POST http://localhost:3001/vacations/followed_vacations/
router.post("/followed_vacations/", async (request, response, next) => {
    let vacationId = request.body.vacationId;
    let userId = cache.extractUserDataFromCache(request).id;
    try {
        await vacationsLogic.followVacation(userId, vacationId);
        response.json();
    }
    catch (error) {
        return next(error);
    }
});

// UNFOLLOW VACATION
// DELETE http://localhost:3001/vacations/followed_vacations/:id
router.delete("/followed_vacations/:id", async (request, response, next) => {
    let vacationId = request.params.id;
    let userId = cache.extractUserDataFromCache(request).id;
    try {
        await vacationsLogic.unfollowVacation(userId, vacationId);
        response.json();
    }
    catch (error) {
        return next(error);
    }
});

// GET FOLLOWED VACATIONS
// GET http://localhost:3001/vacations/followed_vacations/
router.get("/followed_vacations/", async (request, response, next) => {
    let userType = cache.extractUserDataFromCache(request).userType;
    
    try {
        let vacationsStats = await vacationsLogic.getFollowedVacationsStats(userType);
        response.json(vacationsStats);
    }
    catch (error) {
        return next(error);
    }
});

module.exports = router;