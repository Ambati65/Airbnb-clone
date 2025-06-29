const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

const configurePassport = () => {
    // Configure passport to use local strategy
    passport.use(new LocalStrategy(User.authenticate()));
    
    // Serialize and deserialize user for session management
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
};

module.exports = configurePassport;
