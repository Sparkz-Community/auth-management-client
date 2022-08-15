<template>
  <q-page id="registerPage" class="flex flex-center" v-bind="$attrs['page-attrs']">
    <register v-bind="$attrs['attrs']"></register>
  </q-page>
</template>

<script>
  import register from '../../../components/register/baseRegister/register';

  export default {
    name: 'registerPage',
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

<style scoped lang="scss" src="./_registerPage.scss">
</style>
