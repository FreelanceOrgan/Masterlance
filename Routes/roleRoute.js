const express = require("express");

const router = express.Router();
const {getAllRoles, getRoleById, addRole, updateRole, deleteRole} = require("../Controllers/roleController");
const {idValidation} = require("../Middlewares/idValidation")
const {addRoleValidation, updateRoleValidation, deleteRoleValidation} = require("../Middlewares/roleValidation")
const {authentication, authorization} = require("../Services/authService");

router.route("/")
    .all(authentication, authorization("roles"))
    .get(getAllRoles)
    .post(addRoleValidation, addRole)

router.route("/:id")
    .all(authentication, authorization("roles"), idValidation)
    .get(getRoleById)
    .patch(updateRoleValidation, updateRole)
    .delete(deleteRoleValidation, deleteRole)


module.exports = router;
