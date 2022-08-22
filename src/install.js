import {FormGenClientLib} from './packages';

import * as components from './components';

const install = (app, {prefix, loadFormGen = true, loadComponents = false} = {}) => {
  if (loadFormGen) {
    app.use(FormGenClientLib);
  }

  if (loadComponents) {
    for (let key in components) {
      let _key = prefix ? prefix + key : key;
      app.component(_key, components[key]);
    }
  }
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default { install };
