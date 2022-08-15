<template>
  <q-page id="OAuthLoginFormPage" class="flex flex-center" style="background: #FAFBFD;" v-bind="$attrs['page-attrs']">
    <o-auth-login-form v-bind="$attrs['attrs']"></o-auth-login-form>
  </q-page>
</template>

<script>
  import OAuthLoginForm from '../../../components/login/OAuthLoginForm/OAuthLoginForm';

  export default {
    name: 'OAuthLoginFormPage',
    inheritAttrs: false,
    components: {
      OAuthLoginForm,
    },
    data() {
      return {};
    },
    methods: {}
  };
</script>

<style scoped lang="scss" src="./_OAuthLoginFormPage.scss">

</style>
