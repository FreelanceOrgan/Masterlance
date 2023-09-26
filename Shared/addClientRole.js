const roleModel = require("../Models/roleModel");

const addClientRole = async (request, resposne, next) => {
    const ClientRoleId = await roleModel.findOne({slug: "client"}, {_id: 1});
    request.body.role = ClientRoleId._id;
    next();
}

module.exports = {addClientRole};