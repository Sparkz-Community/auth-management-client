<template>
  <div id="verifyAndSetPassword" v-bind="$attrs['div-attrs']">
    <q-card v-if="error === false" v-bind="$attrs['card-attrs']">
      <q-card-section class="flex column flex-center">
        <q-icon v-bind="$attrs['card-icon-attrs']"></q-icon>
        <h4 v-if="title" class="q-my-none">{{ title }}</h4>
        <p>Type your new password here.</p>
      </q-card-section>

      <q-card-section>
        <form-generator v-model="formData"
                        :fields="fields"
                        useQform
                        v-model:valid="valid"
                        @keyup="keyupEnter"></form-generator>
      </q-card-section>

      <q-card-actions class="flex flex-center">
        <q-btn :disable="!valid" @click="resetPassword" v-bind="$attrs['update-btn-attrs']"></q-btn>
      </q-card-actions>
    </q-card>
    <q-card v-if="error === true" class="q-pa-xl text-h6" v-bind="$attrs['card-attrs']">
      Something went wrong. Click<span class="text-weight-bold text-primary pointer" @click="$router.push('/')"> here to be redirected.</span>
    </q-card>
  </div>
</template>

<script>
  import axios from 'axios';
  import {mapActions} from 'vuex';

  import {LodashMixin} from '../../../mixins';

  export default {
    name: 'verifyAndSetPassword',
    inheritAttrs: false,
    mixins: [
      LodashMixin({methodsToAdd: ['$lget']}),
    ],
    props: {
      redirectUrl: {
        type: [String, Object],
        default() {
          return {
            path: '/',
          };
        },
      },
      fieldsColor: {type: String, default: 'primary'},
      title: {
        type: String,
        default: 'Set Password',
      },
    },
    data() {
      return {
        error: false,
        valid: false,
        formData: {},
        fields: [
          {
            fieldType: 'TextInput',
            path: 'password',
            slots: ['prepend', 'append'],
            attrs: {
              label: 'New Password',
              type: 'password',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              color: this.fieldsColor,
              rules: [
                val => {
                  return val && val.length > 0 || 'Password can\'t be empty';
                }
              ],
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'confirm_password',
            slots: ['prepend', 'append'],
            attrs: {
              label: 'Confirm New Password',
              type: 'password',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              color: this.fieldsColor,
              rules: [
                val => {
                  return val && val.length > 0 || 'Confirm Password can\'t be empty';
                },
                val => {
                  return val === this.$lget(this.formData, 'password', '') || 'Must match password';
                }
              ],
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ],
      };
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', ''));

          // card-attrs defaults
          this.$lset(newVal, 'card-attrs.class', this.$lget(newVal, 'card-attrs.class', ''));

          // card-icon-attrs defaults
          this.$lset(newVal, 'card-icon-attrs.class', this.$lget(newVal, 'card-icon-attrs.class', 'text-h1 q-my-md'));
          this.$lset(newVal, 'card-icon-attrs.name', this.$lget(newVal, 'card-icon-attrs.name', 'lock'));

          // update-btn-attrs defaults
          this.$lset(newVal, 'update-btn-attrs.color', this.$lget(newVal, 'update-btn-attrs.color', 'secondary'));
          this.$lset(newVal, 'update-btn-attrs.class', this.$lget(newVal, 'update-btn-attrs.class', 'q-px-lg q-mb-lg'));
          this.$lset(newVal, 'update-btn-attrs.size', this.$lget(newVal, 'update-btn-attrs.size', 'lg'));
          this.$lset(newVal, 'update-btn-attrs.label', this.$lget(newVal, 'update-btn-attrs.label', 'Update Password'));
        },
      },
    },
    methods: {
      ...mapActions('auth', {
        authenticate: 'authenticate',
      }),
      keyupEnter(path, event) {
        if (event.key === 'Enter') {
          if (path === 'confirm_password') {
            this.resetPassword();
          }
        }
      },
      resetPassword() {
        if (this.valid) {
          this.$q.loading.show();
          axios.post((process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030') + '/authManagement', {
            action: 'verifySignupSetPasswordLong',
            value: {
              token: this.$route.query.token,
              password: this.formData.password,
            },
            notifierOptions: {
              link_source: this.$lget(this.$route, 'query.link_source', undefined),
            },
          }).then((res) => {
            this.$q.loading.hide();
            console.log(res);

            this.authenticate({
              strategy: 'local',
              email: res.data.email,
              password: this.formData.password,
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

                this.$router.push({name: 'login'});
              });
          }).catch((err) => {
            this.$q.loading.hide();
            this.error = true;
            console.log(err);
          });
        }
      },
    },
  };
</script>

<style scoped lang="scss" src="./_verifyAndSetPassword.scss">

</style>
