const batch = require('./batch/batch.service.js');
const users = require('./users/users.service.js');

const authManagement = require('@ionrev/ir-auth-management-server');

const extendIrRolesRoles = require('./extend-ir-roles-roles/extend-ir-roles-roles.service.js');
const extendIrRolesAbilities = require('./extend-ir-roles-abilities/extend-ir-roles-abilities.service.js');
const extendIrRolesRules = require('./extend-ir-roles-rules/extend-ir-roles-rules.service.js');

const geocode = require('./geocode/geocode.service.js');
const placesAutoComplete = require('./places-auto-complete/places-auto-complete.service.js');
const servicesExpose = require('./services-expose/services-expose.service.js');
const fileUploader = require('./file-uploader/file-uploader.service.js');
const uploads = require('./uploads/uploads.service.js');
const wallets = require('./wallets/wallets.service.js');


// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(batch);
  app.configure(users);

  authManagement.services.configureServices(app);
  app.configure(extendIrRolesRoles);
  app.configure(extendIrRolesAbilities);
  app.configure(extendIrRolesRules);

  app.configure(geocode);
  app.configure(placesAutoComplete);
  app.configure(fileUploader);
  app.configure(uploads);
  app.configure(servicesExpose);
  app.configure(wallets);
};
