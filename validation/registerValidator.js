const {check, body} = require('express-validator');
const {loadUsers} = require('../database/db_users');

module.exports = [
    check('name')
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isLength({
            min : 2
        }).withMessage('Mínimo 2 caracteres').bail()
        .isAlpha('es-ES').withMessage('Solo caracteres alfabéticos'),
    body('email')
        .notEmpty().withMessage('El email es obligatorio').bail()
        .isEmail().withMessage('Debe ser un email válido').bail()
        .custom((value, {req}) => {
            const user = loadUsers().find(user => user.email === value);

            if(user){
                return false
            }else {
                return true
            }
        }).withMessage('El email ya se encuentra registrado'),

    check('password')
        .notEmpty().withMessage('La contraseña es obligatoria').bail()
        .isLength({
            min : 6, 
            max : 12
        }).withMessage('La contraseña debe tener entre 6 y 12 caracteres'),
        check('edad')
        .notEmpty().withMessage('La edad es obligatoria').bail()
    ,
    body('password2')
        .notEmpty().withMessage('Debes confirmar la contraseña').bail()
        .custom((value,{req}) => {
            if(value !== req.body.password){
                return false
            }
            return true
        }).withMessage('Las contraseñas no coinciden'),
    
    check('terms')
        .isString('on').withMessage('Debes aceptar los términos y condiciones')
    
]