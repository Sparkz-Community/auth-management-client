<template>
  <q-page id="loginPage" class="flex flex-center" v-bind="$attrs['page-attrs']">
    <login v-bind="$attrs['attrs']"></login>
  </q-page>
</template>

<script>
  import login from '../../../components/login/baseLogin/login';

  export default {
    name: 'loginPage',
    inheritAttrs: false,
    components: {
      login,
    },
    data() {
      return {};
    },
    methods: {}
  };
</script>

<style scoped lang="scss" src="./_loginPage.scss">
</style>
