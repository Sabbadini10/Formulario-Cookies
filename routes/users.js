var express = require('express');
var router = express.Router();

const {login,perfil,register, processRegister, processLogin,logout, processPerfil, form_color} = require('../controllers/usersControllers');

const { uploadUsers } = require('../middleware/uploadUsers');
const sessionCheck = require('../middleware/mw_users/sessionCheck');
const loginValidator = require('../validation/loginValidator');
const registerValidator = require('../validation/registerValidator');

/* /users */
router
  .get('/registro',register)
  .post('/registro',registerValidator,uploadUsers.single('avatar'), processRegister)
  .get('/login',login) 
  .post('/login',loginValidator, processLogin)
  .get('/perfil',sessionCheck, perfil)
  .post('/perfil',sessionCheck,processPerfil)
  .get('/form_color', sessionCheck,form_color)
  .get('/logout',logout)

module.exports = router;