import {colors} from 'quasar';

export default async ({Vue}) => {
  Vue.mixin({
    methods: {
      // eslint-disable-next-line no-unused-vars
      $lightenHex(cssVar, amt = 40) {
        let color = this.$getCssVar(cssVar);
        let r = colors.hexToRgb(color);
        return `rgba(${r.r + amt}, ${r.g + amt}, ${r.b + amt}, ${!this.$lisEmpty(r.a) ? r.a / 100 : '1'})`;
      }
    }
  })
  ;
};
