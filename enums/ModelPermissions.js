const ModelNames = {
  Users: 'users',
  Roles: 'roles',
  Transactions: 'transactions',
  Messages: 'messages',
}

const ModelPermissions = {
  Read: 'get',
  Create: 'post',
  Update: 'patch',
  Delete: 'delete'
}

Object.freeze(ModelNames);
Object.freeze(ModelPermissions);

module.exports = {ModelNames, ModelPermissions}