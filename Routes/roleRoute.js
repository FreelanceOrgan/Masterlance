const express = require("express");

const router = express.Router();
const {getAllRoles, getRoleById, addRole, updateRole, deleteRole} = require("../Controllers/roleController");
const {idValidation} = require("../Middlewares/idValidation")
const {addRoleValidation, updateRoleValidation, deleteRoleValidation} = require("../Middlewares/roleValidation")
const {authentication, authorization} = require("../Services/authService");
const {ModelNames} = require('../enums/ModelPermissions');

router.route("/")
    .all(authentication, authorization(ModelNames.Roles))
    .get(getAllRoles)
    .post(addRoleValidation, addRole)

router.route("/:id")
    .all(authentication, authorization(ModelNames.Roles), idValidation)
    .get(getRoleById)
    .patch(updateRoleValidation, updateRole)
    .delete(deleteRoleValidation, deleteRole)


module.exports = router;
