const userModel = require("../Models/userModel");
const roleModel = require("../Models/roleModel");
const {ModelNames, ModelPermissions} = require('../enums/ModelPermissions');

exports.upsertMainItemsIntoDB = async () => {
  const allowedModelsForClient = [
    {
      modelName: ModelNames.Users,
      permissions: [ModelPermissions.Read, ModelPermissions.Create, ModelPermissions.Update, ModelPermissions.Delete]
    },
    {
      modelName: ModelNames.Transactions,
      permissions: [ModelPermissions.Read, ModelPermissions.Create, ModelPermissions.Update, ModelPermissions.Delete]
    },
  ];

  const allowedModelsForAdmin = [
    ...allowedModelsForClient,
    {
      modelName: ModelNames.Roles,
      permissions: [ModelPermissions.Read, ModelPermissions.Create, ModelPermissions.Update, ModelPermissions.Delete]
    },
    {
      modelName: ModelNames.Messages,
      permissions: [ModelPermissions.Read, ModelPermissions.Create, ModelPermissions.Update, ModelPermissions.Delete]
    },
  ];

  const isRolesExist = await roleModel.find({ slug: { $in: ['super-admin', 'client'] } });

  if(isRolesExist.length > 0) {
    isRolesExist.forEach((role) => {
      if(role.slug === 'super-admin') {
        role.allowedModels = allowedModelsForAdmin;
        role.save();
      }

      if(role.slug === 'client') {
        role.allowedModels = allowedModelsForClient;
        role.save();
      }
    }); 
  }
  else {
    const roles = await Promise.all([
      roleModel.create({
        name: "Super Admin",
        slug: "super-admin",
        description: "This is highly privileged and authoritative user role within a system or organization's administrative hierarchy.",        
        allowedModels: allowedModelsForAdmin
      }),
      roleModel.create({
        name: "Client",
        slug: "client",
        allowedModels: allowedModelsForClient
      })
    ]);
  
    await userModel.create({
      fullName: process.env.fullName,
      email: process.env.email,
      password: process.env.password,
      mobilePhone: process.env.mobilePhone,
      whatsAPP: process.env.whatsAPP,
      role: roles[0]._id
    });
  }

  console.log('Main Items are upsert successfully');
}
