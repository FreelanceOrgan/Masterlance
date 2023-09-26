const express = require("express");

const router = express.Router();
const {getAllRoles, getRoleById, addRole, updateRole, deleteRole} = require("../Controllers/roleController");
const {idValidation} = require("../Middlewares/idValidation")
const {addRoleValidation, updateRoleValidation} = require("../Middlewares/roleValidation")
const {authontication, authorization} = require("../Services/authService");

router.route("/")
    .all(authontication, authorization("roles"))
    .get(getAllRoles)
    .post(addRoleValidation, addRole)

router.route("/:id")
    .all(authontication, authorization("roles"), idValidation)
    .get(getRoleById)
    .patch(updateRoleValidation, updateRole)
    .delete(deleteRole)


module.exports = router;
