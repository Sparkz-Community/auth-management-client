import { defineAuthStore, models } from 'feathers-pinia';

const $lget = require('lodash/get');

export default (
  {
    feathersClient,
    state = () => ({}),
    getters = {},
    actions = {},
    Users,
    Logins,
    Accounts,
    userService = 'users',
  } = {}) => {
  return defineAuthStore({
    feathersClient,
    userService,
    state() {
      return {
        userId: null,

        rules: [],
        logins: [],
        activeLoginId: null,
        accounts: [],
        activeAccountId: null,

        ...state(),
      };
    },
    getters: {
      authUser() {
        return this.userId ? Users.getFromStore(this.userId) : null;
      },
      activeLogin() {
        return this.activeLoginId ? Logins.getFromStore(this.activeLoginId) : null;
      },
      activeAccount() {
        return this.activeAccountId ? Accounts.getFromStore(this.activeAccountId) : null;
      },

      ...getters,
    },
    actions: {
      handleResponse(response) {
        this.payload = response || null;
        this.userId = response.user.id || response.user._id;

        this.rules = $lget(response.user, '_fastjoin.rules', []);
        if (Logins && Accounts) {
          this.logins = $lget(response.user, '_fastjoin.logins.ids', []).map(login => {
            let model = new models.api.Logins(login);
            model.addToStore();
            return model;
          });
          let login = $lget(response.user, '_fastjoin.logins.active', this.logins[0] || undefined);
          if (login) this.activeLoginId = login._id;
          this.accounts = $lget(this.activeLogin, '_fastjoin.accounts.owns.ids', []).map(account => {
            let model = new models.api.Accounts(account);
            model.addToStore();
            return model;
          });
          let account = $lget(this.activeLogin, '_fastjoin.accounts.owns.active', this.accounts[0] || undefined);
          if (account) this.activeAccountId = account._id;
        }

        Users.addToStore(response.user);
        return response;
      },
      logout() {
        return this.feathersClient
          .logout()
          .then(response => {

            this.payload = null;
            this.userId = null;
            if (this.user) {
              this.user = null;
            }
            return response;
          })
          .catch(error => {
            return Promise.reject(error);
          });
      },

      ...actions,
    },
  });
};
