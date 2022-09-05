var express = require('express');
var router = express.Router();

const {login,perfil,register, processRegister, processLogin,logout, bienvenido} = require('../controllers/usersControllers');

const { uploadUsers } = require('../middleware/uploadUsers');
const userSessionCheck = require('../middleware/sessionCheck');
const loginValidator = require('../validation/loginValidator');
const registerValidator = require('../validation/registerValidator');

/* /users */
router
  .get('/registro',register) // /users/register
  .post('/registro',registerValidator, processRegister)
  .get('/login',login) // /users/login
  .post('/login',loginValidator, processLogin)
  .get('/perfil',userSessionCheck, perfil) // /users/profile
  .post('/bienvenido',uploadUsers.single('avatar'), bienvenido)
  .get('/logout',logout)

module.exports = router;