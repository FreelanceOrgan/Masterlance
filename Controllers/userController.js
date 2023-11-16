const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const responseFormatter = require("../ResponseFormatter/responseFormatter");
const APIError = require("../ErrorHandler/APIError");
const userModel = require("../Models/userModel");
const {getAllDocuments, getDocumentById, addDocument, updateDocument, softDeleteDocument} = require("./Base/baseController");

const searchFields = ["firstName", "lastName", "email", "mobilePhone", "whatsAPP", "role"];
exports.getAllUsers = getAllDocuments(userModel, 'Users', ...searchFields);

exports.getUserById = getDocumentById(userModel, 'User');

exports.addUser = addDocument(userModel, 'User');

const allowedFieldsToUpdate = ["firstName", "lastName", "mobilePhone", "whatsAPP", "profileImage", "available"];
exports.updateUser = updateDocument(userModel, 'User', ...allowedFieldsToUpdate);

exports.updateUserRole = updateDocument(userModel, 'User', "role");

exports.upsertNationalIdImages = asyncHandler(async (request, response, next) => {
	const {id} = request.params;
	const user = await userModel.findById(id);
	if(!user) {
		throw new APIError('This user does not exist', 400);
	}
	user.freelancer.nationalIdImage = request.body.nationalIdImage;
	user.freelancer.selfieWithNationalIdImage = request.body.selfieWithNationalIdImage;
	await user.save();
	response.status(200).json(responseFormatter(true, 'Your verification images are uploaded successfully', [{
		nationalIdImage: user.freelancer.nationalIdImage,
		selfieWithNationalIdImage: user.freelancer.selfieWithNationalIdImage
	}]))
});

exports.upsertVerificationStatus = asyncHandler(async (request, response, next) => {
	const {id} = request.params;
	const user = await userModel.findById(id);
	if(!user) {
		throw new APIError('This user does not exist', 400);
	}
	user.freelancer.isUserVerified = request.body.isUserVerified;
	await user.save();
	response.status(200).json(responseFormatter(true, 'User verification status is updated successfully', [{
		isUserVerified: user.freelancer.isUserVerified
	}]))
});

exports.blockUser = updateDocument(userModel, 'User', "blocked");

exports.changeEmail = asyncHandler(async (request, response, next) => {
	const user = await userModel.findOne({_id: request.params.id, email: request.body.currentEmail}, {password: 1});
	if(user && bcrypt.compareSync(request.body.password, user.password)){
		user.email = request.body.newEmail;
		user.password = request.body.password;
		user.passwordUpdatedTime = Date.now();
		await user.save();
		response.status(200).json(responseFormatter(true, 'Your email is updated successfully, please login again.')); // generate token and send it
		return;
	}
	next(new APIError('Your email or password may be incorrect', 400));
});

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
});

exports.deleteUser = softDeleteDocument(userModel, 'User');