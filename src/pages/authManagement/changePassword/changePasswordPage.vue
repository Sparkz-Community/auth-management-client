<template>
  <q-page id="changePasswordPage" class="flex flex-center" v-bind="$attrs['page-attrs']">
    <change-password v-bind="$attrs['attrs']"></change-password>
  </q-page>
</template>

<script>
  import changePassword from '../../../components/authManagement/changePassword/changePassword';

  export default {
    name: 'changePasswordPage',
    inheritAttrs: false,
    components: {
      changePassword,
    },
    data() {
      return {};
    },
    methods: {}
  };
</script>

<style scoped>

</style>
