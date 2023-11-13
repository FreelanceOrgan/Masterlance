const roleModel = require("../Models/roleModel");

const addFreelancerRole = async (request, resposne, next) => {
    const freelancerRoleId = await roleModel.findOne({slug: "freelancer"}, {_id: 1});
    request.body.role = freelancerRoleId._id;
    next();
}

module.exports = {addFreelancerRole};