const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");
let connection = require("./connection-wrapper");

async function getAllVacations() {
    let sql = `SELECT id,
                    destination,
                    description,
                    image_url AS 'imageUrl',
                    start_date AS 'startDate',
                    end_date AS 'endDate',
                    price
                FROM vacations`;
    let vacations;
    try {
        vacations = await connection.execute(sql);
    }
    catch (error) {
        console.error(error);
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }

    return vacations;
}

async function getAllVacationsForUser(userId) {
    let sql = `SELECT 
                vacations.id,
                vacations.destination,
                vacations.description,
                vacations.image_url AS 'imageUrl',
                vacations.start_date AS 'startDate',
                vacations.end_date AS 'endDate',
                vacations.price,

                CASE
                    WHEN vacations_followed.vacation_id IS NOT NULL THEN 1
                    ELSE 0
                END AS 'isFollowing',

                CASE
                    WHEN count_followers.followers IS NOT NULL THEN count_followers.followers
                    ELSE 0
                END AS 'numOfFollowers'

                FROM
                    vacations
                    
                        LEFT JOIN
                    (SELECT vacation_id 
                        FROM followed_vacations 
                        WHERE user_id = ?) vacations_followed 
                    ON vacations.id = vacations_followed.vacation_id
                        
                        LEFT JOIN
                    (SELECT vacation_id, COUNT(vacation_id) AS 'followers'
                        FROM followed_vacations
                        GROUP BY vacation_id) count_followers 
                    ON vacations.id = count_followers.vacation_id`;

    let parameters = [userId];
    let vacations;

    try {
        vacations = await connection.executeWithParameters(sql, parameters);
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }

    return vacations;
}

async function addVacation(vacation) {
    let sql = `INSERT INTO vacations 
                (id,destination, description, image_url, start_date, end_date, price) 
                VALUES(?,?,?,?,?,?,?)`;
    let parameters = [vacation.id,
        vacation.destination, 
        vacation.description, 
        vacation.imageUrl, 
        vacation.startDate.split("T")[0], 
        vacation.endDate.split("T")[0], 
        vacation.price];
    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
}

async function updateVacation(vacation) {
    let sql = `UPDATE vacations 
                SET destination = ?, 
                    description=?, 
                    image_url=?, 
                    start_date=?, 
                    end_date=?, 
                    price=? 
                WHERE id=?`;
    let parameters = [vacation.destination, 
        vacation.description, 
        vacation.imageUrl, 
        vacation.startDate.split("T")[0], 
        vacation.endDate.split("T")[0], 
        vacation.price, 
        vacation.id];

    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
}

async function deleteVacation(id) {
    let sql = "DELETE FROM vacations WHERE id=?";
    let parameters = [id];
    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
}

async function deleteVacationFollows(id) {
    let sql = "DELETE FROM followed_vacations WHERE vacation_id=?";
    let parameters = [id];
    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
}

async function followVacation(userId, vacationId) {
    let sql = "INSERT INTO followed_vacations (user_id, vacation_id) VALUES(?,?)";
    let parameters = [userId, vacationId];

    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
}

async function unfollowVacation(userId, vacationId) {
    let sql = `DELETE FROM followed_vacations 
                WHERE user_id=? AND vacation_id=?`;
    let parameters = [userId, vacationId];

    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }
}

async function getFollowedVacationsStats(){
    let sql = `SELECT vacation_id AS vacationId, COUNT(vacation_id) AS 'numOfFollowers'
                FROM followed_vacations
                GROUP BY vacation_id`;
    try {
        return await connection.execute(sql);
    }
    catch (error) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, error);
    }

}

module.exports = {
    getAllVacations,
    addVacation,
    updateVacation,
    deleteVacation,
    getAllVacationsForUser,
    followVacation,
    unfollowVacation,
    deleteVacationFollows,
    getFollowedVacationsStats
};