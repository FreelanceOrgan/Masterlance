const roleModel = require("../Models/roleModel");

exports.addFreelancerRole = async (request, response, next) => {
	const freelancerRole = await roleModel.findOne({slug: "freelancer"}, {_id: 1});
	request.body.role = freelancerRole._id;
	next();
}