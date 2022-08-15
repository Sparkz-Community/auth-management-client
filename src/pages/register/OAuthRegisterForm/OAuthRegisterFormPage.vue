<template>
  <q-page id="OAuthRegisterFormPage" class="flex flex-center" style="background: #FAFBFD;" v-bind="$attrs['page-attrs']">
    <o-auth-register-form v-bind="$attrs['attrs']"></o-auth-register-form>
  </q-page>
</template>

<script>
  import OAuthRegisterForm from '../../../components/register/OAuthRegisterForm/OAuthRegisterForm';

  export default {
    name: 'OAuthRegisterFormPage',
    inheritAttrs: false,
    components: {
      OAuthRegisterForm
    },
    data() {
      return {};
    },
    methods: {}
  };
</script>

<style scoped lang="scss" src="./_OAuthRegisterFormPage.scss">

</style>
