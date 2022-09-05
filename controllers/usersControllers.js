const {loadUsers, storeUsers} = require('../database/db_users');
const {loadColores,storeColores} = require('../database/db_colores')
const {validationResult} = require('express-validator');
const bcryptjs = require('bcryptjs');
const fs = require('fs');
const path = require('path');

module.exports = {
register : (req,res) => {
    const user = loadUsers()
        return res.render('registro',{
            user
        })
    },
    processRegister : (req,res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()){
            const users = loadUsers();
        const {name, email, edad, avatar, color, password, password2, recordarColor} = req.body;
           const newUser = {
                id: users[users.length - 1] ? users[users.length - 1].id + 1 : 1,
                name : name.trim(),
                color,
                email : email.trim(),
                edad,
                password : bcryptjs.hashSync(password.trim(),10),
                password2 : bcryptjs.hashSync(password2.trim(),10),
                rol : 'user',
                avatar : [`../images/avatar/${avatar}`] ? [`../images/avatar/${avatar}`] : [`../images/avatar/imagenDefault.jpg`]
            
           }

           req.session.backgroundColor = color;
           res.locals.backgroundColor = req.session.backgroundColor;
           
           if(recordarColor){
               res.cookie('backgroundColor', req.session.backgroundColor, { maxAge: 1000 * 60})
           }
    
           const usersModify = [...users, newUser];
    
           storeUsers(usersModify);
           return res.redirect('/users/perfil')
        }else {
            return res.render('registro', {
                errors : errors.mapped(),
                colores : loadColores().sort(),
                old : req.body
            })
        }
    },
    login : (req,res) => {
        const user = loadUsers()
        return res.render('login', {
            user
        })
    },
    processLogin : (req,res) => {
        let errors = validationResult(req);

        if(errors.isEmpty()){

            let {id, name, rol, avatar} = loadUsers().find(user => user.email === req.body.email);

            req.session.userLogin = {
                id,
                name,
                rol,
                avatar
            }

            if(req.body.remember){
                res.cookie('formularioCookies',req.session.userLogin,{
                    maxAge : 1000 * 60
                })
            }
            if(req.body.recordarColor){
                res.cookie('formularioCookies',req.session.userLogin,{
                    maxAge : 1000 * 60
                })
            }
            

            return res.redirect('/users/perfil')
        }else {
            return res.render('login',{
                errors : errors.mapped()
            })
        }
    },
    perfil : (req,res) => {
        let user = loadUsers().find(user => user.id === req.session.userLogin.id);
            return res.render('perfil', {
            user,
            colores : loadColores().sort()
       
    })
},
    bienvenido: (req, res) => {

        const {name, email, recordarColor, password, password2, edad, avatar} = req.body;

        let usersModify = loadUsers().map(user => {
            if(user.id === +req.params.id){
                return {
                    ...user,
                    ...req.body,
                    recordarColor,
                    avatar : req.file ? req.file.filename : req.session.userLogin.avatar
                }
            }
            return user
        });

        if(req.file && req.session.usuario.avatar){
            if(fs.existsSync(path.resolve(__dirname,'..','public','images','avatar',req.session.userLogin.avatar))){
                fs.unlinkSync(path.resolve(__dirname,'..','public','images','avatar',req.session.userLogin.avatar))
            }
        }
    
        req.session.userLogin = {
            ...req.session.userLogin,
            name,
            recordarColor,
            avatar : req.file ? req.file.filename : req.session.userLogin.avatar
        }

        storeUsers(usersModify);
        return res.redirect('/user/bienvenido')
        
    },
    logout : (req,res) => {
        req.session.destroy()
        return res.redirect('/')
    }
}