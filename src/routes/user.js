const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLogin, saveRedirectUrl } = require('../middleware/auth');
const userController = require('../controllers/user');

// User routes
router.get('/signup', userController.renderSignup);
router.post('/signup', wrapAsync(userController.signup));

router.get('/login', userController.renderLogin);
router.post('/login', saveRedirectUrl, passport.authenticate('local', { 
    failureRedirect: '/login', 
    failureFlash: true 
}), userController.login);

router.get('/logout', userController.logout);

router.get('/profile', isLogin, wrapAsync(userController.getProfile));
router.get('/profile/edit', isLogin, wrapAsync(userController.renderEditProfile));
router.put('/profile', isLogin, wrapAsync(userController.updateProfile));

module.exports = router;
