const express = require("express");

const router = express.Router();
const {getAllUsers, getUserById, addUser, updateUser, updateUserRole, verifyUser, blockUser, changeEmail, changePassword, deleteUser} = require("../Controllers/userController");
const {idValidation} = require("../Middlewares/idValidation")
const {addUserValidation, updateUserValidation, changeEmailValidation, changePasswordValidation} = require("../Middlewares/userValidation")
const {authentication, authorization, preventClientRole, checkParamIdEqualTokenId} = require("../Services/authService");
const {ModelNames} = require('../enums/ModelPermissions')

router.route("/")
    .all(authentication, authorization(ModelNames.Users), preventClientRole)
    .get(getAllUsers)
    .post(addUserValidation, addUser)

router.route("/:id")
    .all(authentication, authorization(ModelNames.Users), idValidation, checkParamIdEqualTokenId("id"))
    .get(getUserById)
    .patch(updateUserValidation, updateUser)
    .delete(preventClientRole, deleteUser)

router.route("/:id/update/email")
    .patch(changeEmailValidation, changeEmail);
    
router.route("/:id/update/password")
    .patch(changePasswordValidation, changePassword);

router.route("/:id/role")
    .patch(idValidation, authentication, authorization(ModelNames.Users), preventClientRole, updateUserValidation, updateUserRole);

router.route("/:id/verify")
    .patch(idValidation, authentication, authorization(ModelNames.Users), preventClientRole, updateUserValidation, verifyUser);

router.route("/:id/block")
    .patch(idValidation, authentication, authorization(ModelNames.Users), preventClientRole, updateUserValidation, blockUser);

module.exports = router;
