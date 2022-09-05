const {loadUsers, storeUsers} = require('../database/db_users');

controllerIndex = {
    index : (req, res) => {
        const user = loadUsers()
        return res.render('index', {
            user
        })
    }
}

module.exports = controllerIndex;