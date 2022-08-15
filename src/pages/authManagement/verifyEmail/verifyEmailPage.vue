<template>
  <q-page id="verifyEmailPage" class="flex flex-center" v-bind="$attrs['page-attrs']">
    <verify-email v-bind="$attrs['attrs']"></verify-email>
  </q-page>
</template>

<script>
  import verifyEmail from '../../../components/authManagement/verifyEmail/verifyEmail';

  export default {
    name: 'verifyEmailPage',
    inheritAttrs: false,
    components: {
      verifyEmail,
    },
    data() {
      return {};
    },
    methods: {}
  };
</script>

<style scoped>

</style>
