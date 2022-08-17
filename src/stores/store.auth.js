import { defineAuthStore, BaseModel } from 'feathers-pinia';
// import { Users } from './services/users.js';

import $lisNil from 'lodash/isNil';

export class Auth extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }
}

export default async (
  {
    FeathersClient,
    extend_class_fn = (superClass) => superClass,
    state = () => ({}),
    getters = {},
    actions = {},
    Users,
  } = {}) => {

  if ($lisNil(FeathersClient)) {
    throw Error('FeathersClient argument must be set');
  }
  const {
    default: feathersClient,
  } = typeof FeathersClient === 'function' ? await FeathersClient() : FeathersClient;

  let Model = Auth;
  if (typeof extend_class_fn === 'function') {
    Model = extend_class_fn(Auth);
  }

  return defineAuthStore({
    Model,
    clients: { api: feathersClient },
    userService: 'users',
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

      ...actions,
    },
  });
};