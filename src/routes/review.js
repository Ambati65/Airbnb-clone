const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const { isLogin, isReviewAuthor } = require('../middleware/auth');
const reviewController = require('../controllers/review');

// Review routes
router.post('/', isLogin, wrapAsync(reviewController.createReview));

router.delete('/:reviewid', isLogin, isReviewAuthor, wrapAsync(reviewController.destroyReview));

router.get('/', wrapAsync(reviewController.getReviewsForListing));

module.exports = router;
