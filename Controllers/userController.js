const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const responseFormatter = require("../ResponseFormatter/responseFormatter");
const APIError = require("../ErrorHandler/APIError");
const userModel = require("../Models/userModel");
const {getAllDocuments, getDocumentById, addDocument, updateDocument, softDeleteDocument} = require("./Base/baseController");
const {deleteImage} = require("../fileHandler/deleteImage");

// @desc    Get All users
// @route   GET /user
// @access  Public
const searchFields = ["fullName", "email", "mobilePhone", "whatsAPP", "timeZone", "role"];
exports.getAllUsers = getAllDocuments(userModel, 'Users', ...searchFields);

// @desc    Get User by ID
// @route   GET /user/:id
// @access  Public
exports.getUserById = getDocumentById(userModel, 'User');

// @desc    Signup
// @route   POST /User
// @access  Public
exports.addUser = addDocument(userModel, 'User');

// @desc    Update User
// @route   PATCH /user/:id
// @access  Private
const fieldsThatAllowToUpdate = ["fullName", "mobilePhone", "whatsAPP", "timeZone", "profileImage", "available"];
exports.updateUser = updateDocument(userModel, 'User', ...fieldsThatAllowToUpdate);

// @desc    Delete previous User image
// @route   PATCH /user/:id
// @access  Private
exports.removePreviousUserProfileImage = asyncHandler(async (request, response, next) => {
    if(Object.keys(request.files).length > 0) {
        const user = await userModel.findById(request.params.id, {profileImage: 1});
        if(user && user.profileImage) {
            try {
                await deleteImage(user.profileImage);
            }catch(error) {
                throw new Error(error.message);
            }
        }
    }
    next();
})

// @desc    Update User
// @route   PATCH /user/:id/role
// @access  Private
exports.updateUserRole = updateDocument(userModel, 'User', "role");

// @desc    Block User
// @route   PATCH /user/:id
// @access  Private
exports.blockUser = updateDocument(userModel, 'User', "blocked");

// @desc    Change Email
// @route   PATCH /user/:id/update/email
// @access  Private
exports.changeEmail = asyncHandler(async (request, response, next) => {
    const user = await userModel.findOne({_id: request.params.id, email: request.body.currentEmail}, {password: 1});
    if(user && bcrypt.compareSync(request.body.password, user.password)){
        user.email = request.body.newEmail;
        user.password = request.body.password;
        await user.save();
        response.status(200).json(responseFormatter(true, 'Your Email is updated successfully, please login again.')); // generate token and send it
        return;
    }
    next(new APIError('Your email or password may be incorrect', 400));
})

// @desc    Change Password
// @route   PATCH /user/:id/update/password
// @access  Private
exports.changePassword = asyncHandler(async (request, response, next) => {
    const user = await userModel.findOne({_id: request.params.id, email: request.body.email});
    if(user && await bcrypt.compare(request.body.currentPassword, user.password)) {
        user.password = request.body.newPassword;
        user.passwordUpdatedTime = Date.now();
        await user.save();
        response.status(200).json(responseFormatter(true, 'Your Password is updated successfully, please login again.')); // generate token and send it
        return;
    }
    next(new APIError('Your email or password may be incorrect', 400));
})

// @desc    Delete User
// @route   DELETE /api/v1/user/:id
// @access  Private
exports.deleteUser = softDeleteDocument(userModel, 'User');