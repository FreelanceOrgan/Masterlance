const roleModel = require("../Models/roleModel")
const {getAllDocuments, getDocumentById, addDocument, updateDocument, softDeleteDocument} = require("./Base/baseController");

// @desc    Get All Roles
// @route   GET /api/v1/role
// @access  Private
const searchFields = ['name'];
exports.getAllRoles = getAllDocuments(roleModel, 'Roles', ...searchFields);

// @desc    Get role by ID
// @route   GET /api/v1/role/:id
// @access  Private
exports.getRoleById = getDocumentById(roleModel, 'Role');

// @desc    Create role
// @route   POST /api/v1/role
// @access  Private
exports.addRole = addDocument(roleModel, 'Role');

// @desc    Update role
// @route   PATCH /api/v1/role/:id
// @access  Private
const feildsThatAllowToUpdate = ["name", "allowedModels", "available", "deleted"];
exports.updateRole = updateDocument(roleModel, 'Role', ...feildsThatAllowToUpdate);

// @desc    Delete role
// @route   DELETE /api/v1/role/:id
// @access  Private
exports.deleteRole = softDeleteDocument(roleModel, 'Role');
