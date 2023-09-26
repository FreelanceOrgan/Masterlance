const mongoose = require("mongoose");
const slugify = require("slugify");
const AutoIncrement = require('../Config/autoIncrementInitialization')

const allowedModelSchema = new mongoose.Schema(
    {
        modelName: {
            type: String,
            required: [true, "Any role must have one controlled model at least"],
            lowercase: true,
            enum: ['categories', 'subcategories', 'brands', 'products', 'roles', 'wishlists', 'coupons', 'orders', 'reviews', 'users']
        },
        permissions: [{
            type: String,
            required: [true, "Any model must have one permission at least"],
            lowercase: true,
            enum: ['get', 'post', 'patch', 'put', 'delete']
        }],
    },
    {
        _id: false
    }
);

const roleSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.SchemaTypes.Number
        },
        name: {
            type: String,
            trim: true,
            required: [true, 'Role name is required'],
            minlength: [3, 'Too short role name, must be 3 characters at least'],
            maxlength: [32, 'Too long role name, must be 32 characters at most'],
        },
        slug: {
            type: String,
            lowercase: true,        
            unique: [true, 'This role is already found']
        },
        allowedModels: [allowedModelSchema],
        available: {
            type: Boolean,
            default: true
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
)

roleSchema.plugin(AutoIncrement.plugin, {model: 'roles', startAt: 1,});

roleSchema.pre('save', function(next) {
    this.slug = slugify(this.name);
    next();
});

roleSchema.pre('findOneAndUpdate', function(next) {
    if(this._update.name) {
        this._update.slug = slugify(this._update.name);
    }
    next();
});   

const roleModel = mongoose.model("roles", roleSchema);

module.exports = roleModel;