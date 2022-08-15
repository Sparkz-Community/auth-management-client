<template>
  <div v-bind="$attrs['div-attrs']">
    <q-card v-bind="$attrs['card-attrs']">
      <span>{{ verificationMessage }}</span>
      <span @click="handleRedirect"
            v-bind="$attrs['redirect-span-attrs']">redirected in {{ timerCount }} seconds.</span>
    </q-card>
  </div>
</template>

<script>
  import axios from 'axios';
  import {LodashMixin} from '../../../mixins';

  export default {
    name: 'verifyEmail',
    inheritAttrs: false,
    mixins: [
      LodashMixin({methodsToAdd: ['$lget']}),
    ],
    data() {
      return {
        verificationMessage: '',
        error: null,
        timerCount: 10,
      };
    },
    mounted() {
      this.$q.loading.show();
      this.axiosFeathers.post('/authManagement', {
        action: 'verifySignupLong',
        value: this.$route.query.token,
        notifierOptions: {
          link_source: this.$lget(this.$route, 'query.link_source', undefined),
        },
      }).then((res) => {
        this.timerCount--;
        this.verificationMessage = 'Thank you for verifying your email, you will automatically be ';
        this.$q.loading.hide();
        console.log(res);
      }).catch((err) => {
        this.timerCount--;
        this.error = err;
        this.verificationMessage = 'Something went wrong, please try again later, you will automatically be ';
        this.$q.loading.hide();
        console.log(err.message);
      });
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', ''));

          // card-attrs defaults
          this.$lset(newVal, 'card-attrs.class', this.$lget(newVal, 'card-attrs.class', 'q-pa-xl text-h6'));

          // redirect-span-attrs defaults
          this.$lset(newVal, 'redirect-span-attrs.class', this.$lget(newVal, 'redirect-span-attrs.class', 'text-weight-bold text-primary pointer'));
        },
      },
      timerCount: {
        handler(value) {
          if (value > 0) {
            setTimeout(() => {
              this.timerCount--;
            }, 1000);
          } else {
            this.handleRedirect();
          }
        },
      },
    },
    computed: {
      axiosFeathers() {
        return axios.create({
          baseURL: process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030',
          headers: {
            ContentType: 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        });
      },
    },
    methods: {
      handleRedirect() {
        if (this.error !== null) {
          this.$router.push('/');
        } else {
          let next = this.$lget(this.$route, 'query.next');
          if (next) {
            window.location.href = next;
          } else {
            this.$router.push({name: 'login'});
          }
        }
      },
    },
  };
</script>

<style scoped>

</style>
