import {FormGenClientLib} from './packages';

import * as components from './components';

const install = (app, {prefix, useAuthStore, loadFormGen = true, loadComponents = false} = {}) => {
  if (!useAuthStore) throw new Error('useAuthStore is required');

  if (loadFormGen) {
    app.use(FormGenClientLib);
  }

  if (loadComponents) {
    for (let key in components) {
      let _key = prefix ? prefix + key : key;
      app.component(_key, components[key]);
    }
  }

  app.config.globalProperties.$useAuthStore = useAuthStore;
  app.provide('$useAuthStore', useAuthStore);
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default { install };
