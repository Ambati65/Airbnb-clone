const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLogin, isOwner } = require('../middleware/auth');
const listingController = require('../controllers/listing');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

// Listing routes
router.get('/', wrapAsync(listingController.index));

router.get('/new', isLogin, listingController.renderNewForm);

router.get('/:id', wrapAsync(listingController.showListing));

router.get('/:id/edit', isLogin, isOwner, wrapAsync(listingController.renderEditForm));

router.post('/', isLogin, upload.single('listing[image]'), wrapAsync(listingController.createListing));

router.put('/:id', isLogin, isOwner, upload.single('listing[image]'), wrapAsync(listingController.updateListing));

router.delete('/:id', isLogin, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
