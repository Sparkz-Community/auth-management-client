<template>
  <q-page id="resetPasswordPage" class="flex flex-center" v-bind="$attrs['page-attrs']">
    <reset-password v-bind="$attrs['attrs']"></reset-password>
  </q-page>
</template>

<script>
  import resetPassword from '../../../components/authManagement/resetPassword/resetPassword';

  export default {
    name: 'resetPasswordPage',
    inheritAttrs: false,
    components: {
      resetPassword,
    },
    data() {
      return {};
    },
    methods: {}
  };
</script>

<style scoped lang="scss">
</style>
