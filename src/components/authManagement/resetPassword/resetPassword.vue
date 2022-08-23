<template>
  <div id="resetPassword">
    <q-card v-if="error === false">
      <q-card-section class="flex column flex-center">
        <q-icon name="lock" class="text-h1 q-my-md"></q-icon>
        <h4 class="q-my-none">Set Password</h4>
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
        <q-btn color="primary" class="q-px-lg q-mb-lg" size="lg" :disable="!valid" @click="resetPassword">Update Password</q-btn>
      </q-card-actions>
    </q-card>
    <q-card  v-if="error === true" class="q-pa-xl text-h6" >
      Something went wrong. Click<span class="text-weight-bold text-primary pointer" @click="$router.push('/')"> here to be redirected.</span>
    </q-card>
  </div>
</template>

<script>
  import axios from 'axios';

  import {LodashMixin} from '../../../mixins';

  export default {
    name: 'resetPassword',
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
              rules: [
                val => {
                  return val && val.length > 0 || 'Password can\'t be empty';
                }
              ],
            },
            'div-attrs': {
              class: 'col-12'
            }
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
              class: 'col-12'
            }
          },
        ],
      };
    },
    methods: {
      keyupEnter(key, event) {
        if (event.key === 'Enter') {
          if (key === 'confirm_password') {
            this.resetPassword();
          }
        }
      },
      resetPassword(){
        if(this.formData.confirm_password !== this.formData.password){
          this.$q.notify({
            icon: 'fas fa-minus-square',
            message: 'Passwords do not match',
            color: 'negative',
          });
          return;
        }
        this.$q.loading.show();
        axios.post((process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030') + '/authManagement', {
          action: 'resetPwdLong',
          value: {
            password: this.formData.password,
            token: this.$route.query.token,
          },
          notifierOptions: {
            link_source: this.$lget(this.$route, 'query.link_source', undefined),
          }
        }).then((res) => {
          this.$q.loading.hide();
          console.log(res);

          let authStore = this.$useAuthStore();
          authStore.authenticate({
            strategy: 'local',
            email: res.data.email,
            password: this.formData.password,
          })
            .then(result => {
              console.log('result', result);

              this.$q.notify({
                type: 'positive',
                message: `Successfully Logged-in "${result.user.email}"`,
                timeout: 20000,
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
                timeout: 50000,
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
    }
  };
</script>

<style scoped lang="scss">
</style>
