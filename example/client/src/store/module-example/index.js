import state from './state';
import Getters from './getters';
import Mutations from './mutations';
import Actions from './actions';

export default {
  namespaced: true,
  getters: Getters(),
  mutations: Mutations(),
  actions: Actions(),
  state,
};
