const roleModel = require("../Models/roleModel")
const {getAllDocuments, getDocumentById, addDocument, updateDocument, softDeleteDocument} = require("./Base/baseController");

const searchFields = ['name'];
exports.getAllRoles = getAllDocuments(roleModel, 'Roles', ...searchFields);

exports.getRoleById = getDocumentById(roleModel, 'Role');

exports.addRole = addDocument(roleModel, 'Role');

const allowedFieldsToUpdate = ["name", "allowedModels", "available"];
exports.updateRole = updateDocument(roleModel, 'Role', ...allowedFieldsToUpdate);

exports.deleteRole = softDeleteDocument(roleModel, 'Role');
