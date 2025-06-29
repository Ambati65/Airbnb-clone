const User = require('../models/user');
const { UserSchema } = require('../utils/validation');
const ExpressError = require('../utils/ExpressError');

class UserController {
    // Render signup form
    renderSignup(req, res) {
        res.render('users/signup.ejs');
    }

    // Handle signup
    async signup(req, res, next) {
        try {
            const { error } = UserSchema.validate(req.body);
            if (error) {
                throw new ExpressError(400, error.details.map(el => el.message).join(', '));
            }

            const { email, username, password, firstName, lastName } = req.body;
            const newUser = new User({ email, username, firstName, lastName });
            const registeredUser = await User.register(newUser, password);

            req.login(registeredUser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", "Welcome to Wanderlust!");
                res.redirect('/listings');
            });
        } catch (e) {
            req.flash("error", e.message);
            res.redirect('/signup');
        }
    }

    // Render login form
    renderLogin(req, res) {
        res.render('users/login.ejs');
    }

    // Handle login
    login(req, res) {
        req.flash("success", "Welcome back to Wanderlust!");
        const redirectUrl = res.locals.redirectUrl || '/listings';
        res.redirect(redirectUrl);
    }

    // Handle logout
    logout(req, res, next) {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'You have successfully logged out');
            res.redirect('/login');
        });
    }

    // Get user profile
    async getProfile(req, res, next) {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                req.flash('error', 'User not found');
                return res.redirect('/login');
            }
            res.render('users/profile.ejs', { user });
        } catch (error) {
            next(error);
        }
    }

    // Render edit profile form
    async renderEditProfile(req, res, next) {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                req.flash('error', 'User not found');
                return res.redirect('/login');
            }
            res.render('users/edit.ejs', { user });
        } catch (error) {
            next(error);
        }
    }

    // Update user profile
    async updateProfile(req, res, next) {
        try {
            const { email, firstName, lastName } = req.body;
            const userData = { email, firstName, lastName };
            
            const { error } = UserSchema.validate(userData, { abortEarly: false });
            if (error) {
                throw new ExpressError(400, error.details.map(el => el.message).join(', '));
            }

            await User.findByIdAndUpdate(req.user._id, userData);
            
            req.flash('success', 'Profile updated successfully');
            res.redirect('/profile');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
