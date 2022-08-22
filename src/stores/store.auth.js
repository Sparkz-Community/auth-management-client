import { defineAuthStore } from 'feathers-pinia';

import $lisNil from 'lodash/isNil';

export default async (
  {
    FeathersClient,
    state = () => ({}),
    getters = {},
    actions = {},
    Users,
    userService = 'users',
  } = {}) => {

  if ($lisNil(FeathersClient)) {
    throw Error('FeathersClient argument must be set');
  }
  const {
    default: feathersClient,
  } = typeof FeathersClient === 'function' ? await FeathersClient() : FeathersClient;

  return defineAuthStore({
    feathersClient,
    userService,
    state() {
      return {
        userId: null,
        rules: [],
        logins: [],
        activeLogin: {},
        accounts: [],
        activeAccount: {},
        ...state(),
      };
    },
    getters: {
      authUser() {
        return this.userId ? Users.getFromStore(this.userId) : null;
      },

      activeLogin(state, getters, rootState) {
        if (!state.activeLogin) {
          return null;
        }
        const {idField} = rootState['logins'];
        const loginId = state.activeLogin[idField];
        return rootState['logins'].keyedById[loginId] || null;
      },
      activeAccount(state, getters, rootState) {
        if (!state.activeAccount) {
          return null;
        }
        const {idField} = rootState['accounts'];
        const accountId = state.activeAccount[idField];
        return rootState['accounts'].keyedById[accountId] || null;
      },

      ...getters,
    },
    actions: {
      handleResponse(response) {
        this.payload = response || null;
        this.userId = response.user.id || response.user._id;
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
