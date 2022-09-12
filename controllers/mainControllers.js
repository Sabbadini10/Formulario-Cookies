const {loadUsers, storeUsers} = require('../database/db_users');
const {loadColores,storeColores} = require('../database/db_colores')
const {validationResult} = require('express-validator');
const bcryptjs = require('bcryptjs');
const fs = require('fs');
const path = require('path');

controllerIndex = {
    index : (req, res) => {
        const color = loadColores();
        const user = loadUsers()
        return res.render('index', {
            user,
            color
        })
    }
}

module.exports = controllerIndex;