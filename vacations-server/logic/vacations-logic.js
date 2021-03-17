let vacationsDao = require("../dao/vacations-dao");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");
const pushService = require("../services/push-service");

async function getAllVacations() {
    let vacations = await vacationsDao.getAllVacations();
    return vacations;
}

async function getAllVacationsForUser(userId) {
    let vacations = await vacationsDao.getAllVacationsForUser(userId);
    return vacations;
}

async function addVacation(senderId, userType, vacation) {

    if (userType != "ADMIN") {
        throw new ServerError(ErrorType.UNAUTHORIZED_ACTION);
    }

    if (!vacation.destination || !vacation.description ||
        !vacation.imageUrl || !vacation.startDate ||
        !vacation.endDate || !vacation.price) {
        throw new ServerError(ErrorType.MISSING_REQUIRED_FIELDS);
    }

    await vacationsDao.addVacation(vacation);
    
    // Brodcast changes to logged in users 
    let event = {type: "ADD_VACATION", parameters: vacation};
    pushService.asyncBroadcast(event, senderId);
}

async function updateVacation(senderId, userType, vacation) {

    if (userType != "ADMIN") {
        throw new ServerError(ErrorType.UNAUTHORIZED_ACTION);
    }

    if (!vacation.id || !vacation.destination || !vacation.description ||
        !vacation.imageUrl || !vacation.startDate ||
        !vacation.endDate || !vacation.price) {
        throw new ServerError(ErrorType.MISSING_REQUIRED_FIELDS);
    }

    await vacationsDao.updateVacation(vacation);

    // Brodcast changes to logged in users 
    let event = {type: "EDIT_VACATION", parameters: vacation};
    pushService.asyncBroadcast(event, senderId);
}

async function deleteVacation(userType, senderId, vacationId) {

    if (userType != "ADMIN") {
        throw new ServerError(ErrorType.UNAUTHORIZED_ACTION);
    }

    // Delete any follow records of the vacation
    await vacationsDao.deleteVacationFollows(vacationId);

    // Delete the vacation
    await vacationsDao.deleteVacation(vacationId);

    // Brodcast changes to logged in users 
    let event = {type: "DELETE_VACATION", parameters: vacationId};
    pushService.asyncBroadcast(event, senderId);
}

async function followVacation(userId, vacationId) {
    await vacationsDao.followVacation(userId, vacationId);
}

async function unfollowVacation(userId, vacationId) {
    await vacationsDao.unfollowVacation(userId, vacationId);
}

async function getFollowedVacationsStats(userType){
    
    if (userType != "ADMIN") {
        throw new ServerError(ErrorType.UNAUTHORIZED_ACTION);
    }

    let vacationsStats = await vacationsDao.getFollowedVacationsStats();
    return vacationsStats;
}

module.exports = {
    getAllVacations,
    addVacation,
    updateVacation,
    deleteVacation,
    getAllVacationsForUser,
    followVacation,
    unfollowVacation,
    getFollowedVacationsStats
};