const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') 

//load user model
const User = require('../models/User')

module.exports = function(passport){
    passport.use(
        new localStrategy({usernameField: 'email'},(email,password,done) => {
            //match user
            User.findOne({email:email})
            .then(user => {
                //not match
                if(!user){
                    return done(null,false,{message: 'That email is not registered'})
                }

                //match password
                bcrypt.compare(password, user.password, (err,isMatch) =>{
                    if(err) throw err

                    if(isMatch){
                        return done(null,user)
                    }else{
                        return done(null,false,{message:'Password incorrect'})
                    }
                })
            })
            .catch(err => console.log(err))
        })
    )
}