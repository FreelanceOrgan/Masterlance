const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const responseFormatter = require("../ResponseFormatter/responseFormatter");
const APIError = require("../ErrorHandler/APIError");
const userModel = require("../Models/userModel");

// @desc    Get All User Addresses
// @route   GET /api/v1/user/:userId/addresses
// @access  Private
exports.getAllUserAddressByUserId = asyncHandler(async (request, response, next) => {
    const user = await userModel.findById({_id: request.params.userId}, {addresses: 1});
    if(user.addresses.length === 0) {
        response.status(200).json(responseFormatter(true, `This user has no addresses`));
        return;
    }
    response.status(200).json(responseFormatter(true, `The addresses for this user are retrieved successfully`, user.addresses));
})

// @desc    Get specific Address for User by ID
// @route   GET /api/v1/user/:id
// @access  Public
exports.getUserAddressById = asyncHandler(async (request, response, next) => {
    const user = await userModel.findById({_id: request.params.userId}, {addresses: 1});
    const targetAddressIndex = user.addresses.findIndex(address => address.id === request.params.id);
    if(targetAddressIndex === -1) {
        next(new APIError("This address does not exist for this user", 404));
        return;
    }
    response.status(200).json(responseFormatter(true, `The address is retrieved successfully`, [user.addresses[targetAddressIndex]]));
})

// @desc    Add Address for specific user
// @route   POST /api/v1/User/:userId/address
// @access  Private
exports.addUserAddress = asyncHandler(async (request, response, next) => {
    const user = await userModel.findById(request.params.userId, {addresses: 1});
    if(!user) {
        next(new APIError(`This user is not found`, 404));
        return;
    }
    request.body.slug = slugify(request.body.alias).toLowerCase();
    const isAliasNotFound = user.addresses.every((address) => address.slug !== request.body.slug);
    if(isAliasNotFound) {
        if(user.addresses.length === 0) {
            request.body._id = 1;
        }
        else {
            request.body._id = user.addresses[user.addresses.length - 1]._id + 1;
        }
        user.addresses.push(request.body);
        await user.save();
        response.status(200).json(responseFormatter(true, 'The address is addde successfully', [user.addresses[user.addresses.length - 1]]));
    }
    else {
        next(new APIError("This Address is already in found", 403));
    }
})

// @desc    Update Specific Address For Specific User
// @route   PATCH /api/v1/user/:userId/address/id
// @access  Private
exports.updateUserAddress = asyncHandler(async (request, response, next) => {
    const user = await userModel.findById(request.params.userId, {addresses: 1});
    if(!user) {
        next(new APIError("This user does not exist", 404));
        return;
    }
    const targetAddressIndex = user.addresses.findIndex(address => address._id === +request.params.id);
    if(targetAddressIndex === -1) {
        next(new APIError("This address does not exist for this user", 404));
        return;
    }
    if(request.body.alias) {
        request.body.slug = slugify(request.body.alias).toLowerCase();
        const isAliasFound = user.addresses.some((address) => address.slug === request.body.slug && address._id !== request.params.id);
        if(isAliasFound) {
            next(new APIError("This Address is already in found", 403));
            return;
        }
    }
    user.addresses[targetAddressIndex] = request.body;
    await user.save();
    response.status(200).json(responseFormatter(true, `The address is updated successfully`, [user.addresses[targetAddressIndex]]));
})

// @desc    Delete Specific Address For Specific User
// @route   DELETE /api/v1/user/:userId/address/id
// @access  Private
exports.deleteUserAddress = asyncHandler(async (request, response, next) => {
    const user = await userModel.findById({_id: request.params.userId}, {addresses: 1});
    if(!user) {
        next(new APIError(`This user is not found`, 404));
        return;
    }
    const targetAddressIndex = user.addresses.findIndex(address => address.id === request.params.id);
    if(targetAddressIndex === -1) {
        next(new APIError("This address doesn't exist for this user", 404));
        return;
    }
    user.addresses.splice(targetAddressIndex, 1);
    await user.save();
    response.status(200).json(responseFormatter(true, `The address is deleted successfully`));
})
