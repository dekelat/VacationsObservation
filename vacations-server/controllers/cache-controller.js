let cacheMap = new Map();

function put(key, value) {
    cacheMap.set(key, value);
}

function get(key) {
    return cacheMap.get(key);
}

function remove(key) {
    cacheMap.remove(key);
}

function extractUserDataFromCache(request) {
    let authorizationString = request.headers["authorization"];
    let token = authorizationString.substring("Bearer ".length);
    let userData = cacheMap.get(token);
    return userData;
}

module.exports = {
    put,
    get,
    remove,
    extractUserDataFromCache
}