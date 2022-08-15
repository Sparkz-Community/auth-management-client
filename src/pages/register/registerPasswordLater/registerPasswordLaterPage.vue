<template>
  <q-page id="registerPasswordLaterPage" class="flex flex-center" v-bind="$attrs['page-attrs']">
    <register v-bind="$attrs['attrs']"></register>
  </q-page>
</template>

<script>
  import register from '../../../components/register/registerPasswordLater/registerPasswordLater';

  export default {
    name: 'registerPasswordLaterPage',
    inheritAttrs: false,
    components: {
      register
    },
    data() {
      return {};
    },
    methods: {}
  };
</script>

<style scoped lang="scss" src="./_registerPasswordLaterPage.scss">
</style>
