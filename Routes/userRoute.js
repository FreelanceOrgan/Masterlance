const express = require("express");

const router = express.Router();
const {getAllUsers, getUserById, addUser, updateUser, updateUserRole, upsertNationalIdImages, upsertVerificationStatus, blockUser, changeEmail, changePassword, deleteUser} = require("../Controllers/userController");
const {idValidation} = require("../Middlewares/idValidation")
const {addUserValidation, updateUserValidation, upsertNationalIdImagesVerification, changeEmailValidation, changePasswordValidation} = require("../Middlewares/userValidation")
const {authentication, authorization, preventFreelancerRole, checkParamIdEqualTokenId} = require("../Services/authService");
const {ModelNames} = require('../enums/ModelPermissions')

router.route("/")
	.all(authentication, authorization(ModelNames.Users), preventFreelancerRole)
	.get(getAllUsers)
	.post(addUserValidation, addUser)

router.route("/:id")
	.all(authentication, authorization(ModelNames.Users), idValidation, checkParamIdEqualTokenId("id"))
	.get(getUserById)
	.patch(updateUserValidation, updateUser)
	.delete(preventFreelancerRole, deleteUser)
    
router.route("/:id/verify/image")
	.patch(authentication, authorization(ModelNames.Users), checkParamIdEqualTokenId("id"), upsertNationalIdImagesVerification, upsertNationalIdImages);
    
router.route("/:id/verify/status")
	.patch(authentication, authorization(ModelNames.Users), preventFreelancerRole, updateUserValidation, upsertVerificationStatus);

router.route("/:id/update/email")
	.patch(changeEmailValidation, changeEmail);

router.route("/:id/update/password")
	.patch(changePasswordValidation, changePassword);

router.route("/:id/role")
	.patch(idValidation, authentication, authorization(ModelNames.Users), preventFreelancerRole, updateUserValidation, updateUserRole);

router.route("/:id/block")
	.patch(idValidation, authentication, authorization(ModelNames.Users), preventFreelancerRole, updateUserValidation, blockUser);

module.exports = router;
