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
            user,
           colores : require('../database/colores.json')
        })
    },
    processRegister : (req,res) => {
        const errors = validationResult(req);
        const colores = require('../database/colores.json')
        if(errors.isEmpty()){
            const users = loadUsers();
        const {name, email, edad, avatar, color, password, password2} = req.body;
           const newUser = {
                id: users[users.length - 1] ? users[users.length - 1].id + 1 : 1,
                name : name.trim(),
                color,
                email : email.trim(),
                edad,
                password : bcryptjs.hashSync(password.trim(),10),
                password2 : null,
            
           }
          
	
           const usersModify = [...users, newUser];
    
           storeUsers(usersModify);
           return res.redirect('login')
        }else {
            return res.render('registro', {
                errors : errors.mapped(),
                colores,
                old : req.body
            })
        }
    },
    login : (req,res) => {
        const user = loadUsers();
        return res.render('login', {
            user
        })
    },
    processLogin : (req,res) => {
        let errors = validationResult(req);

        if(errors.isEmpty()){

            let {id, name,color,email,edad} = loadUsers().find(user => user.email === req.body.email);

            req.session.userLogin = {
                id,
                name,
                email,
                edad,
                color,
        
            }

            if(req.body.remember){
                res.cookie('formularioCookies',req.session.userLogin,{
                    maxAge : 1000 * 60
                })
            }  

            
            return res.redirect('perfil')
        }else {
            const user = loadUsers()
            return res.render('login',{
                user,
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
    processPerfil: (req, res) => {
        const {name, email, password, edad, color} = req.body;

        let usersModify = loadUsers().map(user => {
            if(user.id === +req.params.id){
                return {
                    ...user,
                    ...req.body,
                    edad,
                    email,
                    color,
                    
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
            color,
            
        
        }


        storeUsers(usersModify);
        return res.redirect('form_color')

    },
    form_color: (req, res) => {
            return res.render('form_color', {
                    user : req.session.userLogin,
            })
        },
    logout : (req,res) => {
        res.clearCookie("formularioCookies"),
        req.session.destroy()
        res.redirect("/")
},
}