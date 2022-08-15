import {lodash} from '../packages';

const {$lset, $lget} = lodash;

export default function ({methodsToAdd = ['$lget', '$lset', '$lfind']} = {}) {
  let mixin = {};

  methodsToAdd.forEach(method => {
    try {
      $lset(mixin, ['methods', method], $lget(lodash, [method]));
    } catch (e) {
      console.error('LodashMixin Error:', e);
    }
  });

  return mixin;
};
