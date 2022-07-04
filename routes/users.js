const express = require("express")
const router = express.Router()
const bcrypy = require('bcryptjs')

//user model
const User = require('../models/User')

//login page
router.get("/login", (req, res) => res.render("login"))

//register page
router.get("/register", (req, res) => res.render("register"))

//register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' })
    }

    //check password math
    if (password != password2) {
        errors.push({ msg: 'Password do not match' })
    }

    //check password lenght
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' })
    }
    if (errors.length > 0) { //not pass
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({email: email})
        .then(user =>{
            if(user){
                //user exists
                errors.push({ msg: 'This email already registerd'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else{
                const newUser = new User({
                    name,
                    email,
                    password
                })
                
            //bcrypt password
            bcrypy.genSalt(5,(err,salt)=>
                bcrypy.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err
                    newUser.password = hash
                    newUser.save()
                    .then(() =>{
                    res.redirect('/users/login')
                    })
                    .catch(err => console.log(err))

                }))
        }})
    }
})
 
//login handle
router.post('/login',(req, res)=>{
    const {email, password} = req.body;
    let errors = [];
    User.findOne({email: req.body.email}).then(user =>{
        if(!user){
            errors.push({ msg: 'This email not registerd' })
            res.render('login', {
                errors,
                email,
                password,
            });
        }else{
            if(bcrypy.compareSync(password,user.password))
            res.render('dashboard', {
                user,
            });
        }
    })
})


module.exports = router;