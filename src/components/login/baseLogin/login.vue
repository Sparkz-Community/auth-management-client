<template>
  <div id="login">
    <q-card v-bind="attrs['card-attrs']">
      <q-card-section class="bg-primary text-white flex items-center">
        <div v-bind="attrs['title-attrs']">Login</div>

        <q-space/>

        <q-btn flat @click="$router.push({name: 'register'})">
          <q-icon name="mdi-code-tags" class="q-mr-xs"></q-icon>
          Register
        </q-btn>
      </q-card-section>

      <q-card-section v-if="!OAuthOff && OAuthTop" class="q-pa-none q-pt-sm">
        <o-auth-links :social-links="socialLinks" :off="OAuthOff" :top="!OAuthTop"></o-auth-links>
      </q-card-section>

      <q-card-section>
        <form-generator v-model="formData"
                        :fields="fields"
                        useQform
                        v-model:valid="valid"
                        @keyup="keyupEnter"></form-generator>
      </q-card-section>

      <q-card-section v-if="!OAuthOff && !OAuthTop" class="q-pa-none q-pb-sm">
        <o-auth-links :social-links="socialLinks" :off="OAuthOff" :top="!OAuthTop"></o-auth-links>
      </q-card-section>

      <q-separator/>

      <q-card-actions>
        <forgot-password v-bind="attrs['forgot-password-attrs']"></forgot-password>
        <q-space></q-space>
        <q-btn @click="Login" :disable="!valid" v-bind="attrs['login-btn-attrs']">Login</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'pinia';
  import useAuthStore from '../../../stores/store.auth';
  import forgotPassword from '../../forgotPassword/forgotPassword.vue';
  import OAuthLinks from '../../OAuthLinks/OAuthLinks';
  import {LodashMixin} from '../../../mixins';

  export default {
    name: 'login',
    inheritAttrs: false,
    mixins: [
      LodashMixin({methodsToAdd: ['$lget', '$lset']}),
    ],
    components: {
      forgotPassword,
      OAuthLinks,
    },
    props: {
      OAuthOff: {type: Boolean, default: false},
      OAuthTop: {type: Boolean, default: true},
      fieldsColor: {type: String, default: 'primary'},
      redirectUrl: {
        type: [String, Object],
        default() {
          return {
            path: '/',
          };
        },
      },
    },
    data() {
      return {
        valid: false,
        formData: {},
        fields: [
          {
            fieldType: 'LoginForm',
            path: 'user',
            childSchemaOverride: {
              email: {
                attrs: {
                  color: this.fieldsColor,
                },
              },
              password: {
                attrs: {
                  color: this.fieldsColor,
                },
              },
            },
          },
        ],
        socialLinks: [
          {
            name: 'Google',
            icon: 'mdi-google',
            img: 'https://rayraysolarstatic.s3-us-west-1.amazonaws.com/Google__G__Logo.svg.png',
            color: 'red',
            link: `${process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030'}/oauth/google`,
          },
          {
            name: 'Facebook',
            icon: 'mdi-facebook',
            color: '#2090E1',
            link: `${process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030'}/oauth/facebook`,
          },
        ],
      };
    },
    watch: {
      loginPending(val) {
        if (![undefined, null].includes(val)) {
          this.$isLoading(val);
        }
      },
    },
    computed: {
      ...mapState(useAuthStore, {
        loginPending: 'isAuthenticatePending',
      }),
      attrs() {
        let newVal = {...this.$attrs};
        // card-attrs defaults
        this.$lset(newVal, 'card-attrs.class', this.$lget(newVal, 'card-attrs.class', 'login-card'));

        // title-attrs defaults
        this.$lset(newVal, 'title-attrs.class', this.$lget(newVal, 'title-attrs.class', 'text-h3'));

        // forgot-password-attrs defaults
        this.$lset(newVal, 'forgot-password-attrs.btn-attrs.flat', this.$lget(newVal, 'forgot-password-attrs.btn-attrs.flat', true));

        // login-btn-attrs defaults
        this.$lset(newVal, 'login-btn-attrs.color', this.$lget(newVal, 'login-btn-attrs.color', 'accent'));
        return newVal;
      },
    },
    methods: {
      ...mapActions(useAuthStore, {
        authenticate: 'authenticate',
      }),
      keyupEnter(pPath, cPath, event) {
        if (event.key === 'Enter') {
          if (`${pPath}.${cPath}` === 'user.password') {
            this.Login();
          }
        }
      },
      Login() {
        this.authenticate({
          strategy: 'local',
          ...this.$lget(this.formData, 'user', {}),
        })
          .then(result => {
            console.log('result', result);

            this.$q.notify({
              type: 'positive',
              message: `Successfully Logged-in "${result.user.email}"`,
              timeout: 5000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });

            this.formData = {};
            if (typeof this.redirectUrl === 'string') {
              this.$routerPreserve({
                path: this.redirectUrl,
              });
            } else {
              this.$routerPreserve(this.redirectUrl);
            }
          })
          .catch(error => {
            console.log('error', error);
            this.$q.notify({
              type: 'negative',
              message: error.message,
              timeout: 20000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          });
        // console.log('auth', auth);
      },
    },
  };
</script>

<style scoped lang="scss" src="./_login.scss">
</style>
