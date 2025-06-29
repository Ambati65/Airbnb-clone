const Joi = require('joi');

const ListingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().trim().max(100),
        description: Joi.string().required().trim().max(1000),
        location: Joi.string().required().trim(),
        country: Joi.string().required().trim(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
    }).required()
});

const ReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required().trim().max(500),
    }).required()
});

const UserSchema = Joi.object({
    username: Joi.string().required().trim().min(3).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    firstName: Joi.string().trim().max(50),
    lastName: Joi.string().trim().max(50)
});

module.exports = {
    ListingSchema,
    ReviewSchema,
    UserSchema
};
