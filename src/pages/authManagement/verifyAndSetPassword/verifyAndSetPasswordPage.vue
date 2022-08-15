<template>
  <q-page id="verifyAndSetPasswordPage" class="flex flex-center" v-bind="$attrs['page-attrs']">
    <verify-and-set-password v-bind="$attrs['attrs']"></verify-and-set-password>
  </q-page>
</template>

<script>
  import verifyAndSetPassword from '../../../components/authManagement/verifyAndSetPassword/verifyAndSetPassword';

  export default {
    name: 'verifyAndSetPasswordPage',
    inheritAttrs: false,
    components: {
      verifyAndSetPassword,
    },
    data() {
      return {};
    },
    methods: {}
  };
</script>

<style scoped lang="scss" src="./_verifyAndSetPasswordPage.scss">

</style>
