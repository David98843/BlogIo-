const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const express = require('express')

require('dotenv').config()


module.exports = app => {

    app.use(express.urlencoded({extended : true}))
    app.set("view engine", 'ejs')
    app.use(cors())
    // SESSION
    app.use(session({
        secret : "keyboard cat",
        resave : true,
        saveUnitialized : true,
    }))

    // PASSPORT
    require('./config/passport')(passport)
    app.use(passport.initialize())
    app.use(passport.session())

    // DATABASE CONNECTION
    let DB_STRING
    if(app.get('env') == 'development'){
        DB_STRING = process.env.DB_STRING
    }else{
        DB_STRING = null
    }
    mongoose.connect(DB_STRING, {
        useNewUrlParser: true
    })
        .then(() => console.log('Database Successfully Connected'))
        .catch(err => console.log(err))

}