const sessionIdToUserMap = new Map();

function setUser(sessionId, user) {
    sessionIdToUserMap.set(id, user);
}

function getUser(id){
    return sessionIdToUserMap.get(id);
}

module.exports = {
    setUser,
    getUser
}
