<template>
  <div id="registerPasswordLater">
    <q-card v-if="registered === true" class="q-pa-xl text-h6">
      <div v-bind="attrs['sentToMessage-div-attrs']">
        An {{ verify_value.join(' & ') }} has been sent to <span v-bind="attrs['sentToMessage-attrs']">{{
          sentToMessage
        }}</span> to verify your
        account.
      </div>
    </q-card>
    <q-card v-if="registered === false" v-bind="attrs['card-attrs']">
      <q-card-section class="bg-primary text-white flex items-center">
        <div v-bind="attrs['title-attrs']">Register</div>

        <q-space/>

        <q-btn flat @click="$router.push({name: 'login'})">
          <q-icon name="mdi-code-tags" class="q-mr-xs"></q-icon>
          Login
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
                        @keyup="keyupEnter">
          <template v-slot:prepend="{key_name}">
            <q-icon v-if="key_name === 'user.name'" name="mdi-account"/>
            <q-icon v-if="key_name === 'user.email'" name="mail"/>
          </template>
        </form-generator>
      </q-card-section>

      <q-card-section v-if="!OAuthOff && !OAuthTop" class="q-pa-none q-pb-sm">
        <o-auth-links :social-links="socialLinks" :off="OAuthOff" :top="!OAuthTop"></o-auth-links>
      </q-card-section>

      <q-separator/>

      <q-card-actions align="right">
        <q-btn @click="verify_dialog = true" :disable="!valid" v-bind="attrs['register-btn-attrs']">Register</q-btn>

        <q-dialog v-model="verify_dialog" persistent>
          <q-card style="min-width: 350px">
            <q-card-section v-bind="attrs['verify-dialog-title-attrs']">
              <div class="text-h6">How would you like to verify your account?</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-checkbox v-model="verify_value" label="Email" val="email" color="accent"/>
              <q-checkbox v-model="verify_value" label="Phone" val="sms" color="accent"/>
              <div v-if="verify_value.includes('sms')">
                <form-generator v-model="formData"
                                :fields="verify_fields"
                                useQform
                                v-model:valid="valid"></form-generator>
              </div>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup/>
              <q-btn flat color="accent" label="Ok" v-close-popup @click="Register"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
  import {models} from 'feathers-pinia';
  import OAuthLinks from '../../OAuthLinks/OAuthLinks';
  import {LodashMixin} from '../../../mixins';

  export default {
    name: 'registerPasswordLater',
    inheritAttrs: false,
    mixins: [
      LodashMixin({methodsToAdd: ['$lget']}),
    ],
    components: {
      OAuthLinks,
    },
    props: {
      OAuthOff: {type: Boolean, default: false},
      OAuthTop: {type: Boolean, default: true},
      fieldsColor: {type: String, default: 'primary'},
      default_verify_value: {
        type: Array,
        default() {
          return ['email'];
        },
      },
    },
    data() {
      return {
        verify_dialog: false,
        verify_value: this.default_verify_value,
        valid: false,
        isPwd: true,
        formData: {},
        registered: false,
        verify_fields: [
          {
            fieldType: 'PhoneInput',
            id: 'user-phone',
            path: 'user.phone',
            attrs: {
              dynamicPlaceholder: false,
              placeholder: 'Phone - (Required)',
              style: 'height: 50px;',
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ],
        fields: [
          {
            fieldType: 'TextInput',
            path: 'user.name',
            attrs: {
              required: true,
              label: 'Name',
              filled: true,
              color: this.fieldsColor,
              rules: [
                val => {
                  return val && val.length > 0 || 'Name can\'t be empty';
                },
              ],
            },
            'div-attrs': {
              class: 'col-12 q-mt-md',
            },
            slots: ['prepend'],
          },
          {
            fieldType: 'TextInput',
            path: 'user.email',
            slots: ['prepend'],
            attrs: {
              label: 'Email',
              type: 'email',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              required: true,
              color: this.fieldsColor,
              rules: [
                val => {
                  return val && val.length > 0 || 'Email can\'t be empty';
                },
                val => {
                  let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
                  return reg.test(val) || 'Must be valid email';
                },
              ],
            },
            'div-attrs': {
              class: 'col-12',
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
    computed: {
      attrs() {
        let newVal = {...this.$attrs};
        // card-attrs defaults
        this.$lset(newVal, 'card-attrs.class', this.$lget(newVal, 'card-attrs.class', 'register-card'));

        // title-attrs defaults
        this.$lset(newVal, 'title-attrs.class', this.$lget(newVal, 'title-attrs.class', 'text-h3'));

        // register-btn-attrs defaults
        this.$lset(newVal, 'register-btn-attrs.color', this.$lget(newVal, 'register-btn-attrs.color', 'accent'));

        // verify-dialog-title-attrs defaults
        this.$lset(newVal, 'verify-dialog-title-attrs.class', this.$lget(newVal, 'verify-dialog-title-attrs.class', 'bg-primary'));

        // sentToMessage-attrs defaults
        this.$lset(newVal, 'sentToMessage-attrs.class', this.$lget(newVal, 'sentToMessage-attrs.class', 'text-weight-bold text-primary'));

        // sentToMessage-div-attrs defaults
        this.$lset(newVal, 'sentToMessage-div-attrs.class', this.$lget(newVal, 'sentToMessage-div-attrs.class', ''));
        return newVal;
      },
      sentToMessage() {
        if (this.verify_value.includes('sms') && this.verify_value.includes('email')) {
          return `${this.$lget(this.formData, 'user.email', 'No Email')} & ${this.$lget(this.formData, 'user.phone.number.international', 'No Number')}`;
        } else if (this.verify_value.includes('email')) {
          return this.$lget(this.formData, 'user.email', 'No Email');
        } else if (this.verify_value.includes('sms')) {
          return this.$lget(this.formData, 'user.phone.number.international', 'No Number');
        } else {
          return '';
        }
      },
    },
    methods: {
      keyupEnter(key, event) {
        if (event.key === 'Enter') {
          if (key === 'confirm_password') {
            this.Register();
          }
        }
      },
      Register() {
        this.$q.loading.show();
        // eslint-disable-next-line no-unused-vars
        let {confirm_password, ...new_user} = this.$lget(this.formData, 'user', {});
        let user = new models.api.Users({
          // email: this.$lget(this.formData, 'user.email'),
          // password: this.$lget(this.formData, 'user.password'),
          ...new_user,
        });
        user.save({verify_methods: this.verify_value, passwordLater: true})
          .then(resp => {
            this.$q.loading.hide();
            // console.log('resp', resp);
            this.registered = true;
            this.$q.notify({
              type: 'positive',
              message: `Successfully Registered "${resp.email}"`,
              timeout: 5000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          })
          .catch(error => {
            this.$q.loading.hide();
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
      },
    },
  };
</script>

<style scoped lang="scss" src="./_registerPasswordLater.scss">
</style>
