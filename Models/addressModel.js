const mongoose = require("mongoose");

const addressSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.SchemaTypes.Number,
        },
        alias: { 
            type: String,
            required: [true, 'Any address must have an alias name'],
            minlength: [3, 'Too short alias, must be 3 characters at least'],
            maxlength: [20, 'Too long alias, must be 20 characters at most']
        },
        slug: {
            type: String,
        },
        country: {
            type: String,
            required: [true, 'Any address must have a country'],
            minlength: [3, 'Too short country, must be 3 characters at least'],
            maxlength: [20, 'Too long country, must be 20 characters at most']
        },
        city: {
            type: String,
            required: [true, 'Any address must have a city'],
            minlength: [3, 'Too short city, must be 3 characters at least'],
            maxlength: [20, 'Too long city, must be 20 characters at most']
        },
        postalCode: {
            type: String,
            required: [true, 'Any address must have a postal code']
        },
        details: {
            type: String,
            required: [true, 'Any address must have details'],
            minlength: [20, 'Too short details, must be 20 characters at least'],
            maxlength: [200, 'Too long details, must be 200 characters at most'],
        }
    }
)

module.exports = addressSchema;