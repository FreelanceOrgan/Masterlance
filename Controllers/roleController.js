const roleModel = require("../Models/roleModel")
const {getAllDocuments, getDocumentById, addDocument, updateDocument, softDeleteDocument} = require("./Base/baseController");

// @desc    Get All Roles
// @route   GET /role
// @access  Private
const searchFields = ['name'];
exports.getAllRoles = getAllDocuments(roleModel, 'Roles', ...searchFields);

// @desc    Get role by ID
// @route   GET role/:id
// @access  Private
exports.getRoleById = getDocumentById(roleModel, 'Role');

// @desc    Create role
// @route   POST /role
// @access  Private
exports.addRole = addDocument(roleModel, 'Role');

// @desc    Update role
// @route   PATCH /role/:id
// @access  Private
const fieldsThatAllowToUpdate = ["name", "allowedModels", "available"];
exports.updateRole = updateDocument(roleModel, 'Role', ...fieldsThatAllowToUpdate);

// @desc    Delete role
// @route   DELETE /role/:id
// @access  Private
exports.deleteRole = softDeleteDocument(roleModel, 'Role');
