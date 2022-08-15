<template>
  <div id="changePassword">
    <q-card v-if="error === false">
      <q-card-section class="flex column flex-center">
        <q-icon name="lock" class="text-h1 q-my-md"></q-icon>
        <h4 class="q-my-none">Change Password</h4>
        <p>Type your new password here.</p>
      </q-card-section>

      <q-card-section>
        <form-generator v-model="formData" :fields="fields" @keyup="keyupEnter">
          <template v-slot:append="{key_name}">
            <q-icon v-if="['password', 'confirm_password'].includes(key_name)"
                    :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd"/>
          </template>
        </form-generator>
      </q-card-section>

      <q-card-actions class="flex flex-center">
        <q-btn color="primary" class="q-px-lg q-mb-lg" size="lg" @click="resetPassword">Update Password</q-btn>
      </q-card-actions>
    </q-card>
    <q-card v-if="error === true" class="q-pa-xl text-h6">
      Something went wrong. Click<span class="text-weight-bold text-primary pointer" @click="$router.push('/')"> here to be redirected.</span>
    </q-card>
  </div>
</template>

<script>
  import axios from 'axios';
  import {LodashMixin} from '../../../mixins';

  export default {
    name: 'changePassword',
    mixins: [
      LodashMixin({methodsToAdd: ['$lget', '$lfind']}),
    ],
    data() {
      return {
        isPwd: true,
        error: false,
        formData: {},
        fields: [
          {
            fieldType: 'TextInput',
            path: 'old_password',
            slots: ['prepend', 'append'],
            attrs: {
              label: 'Old Password',
              type: 'password',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
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
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ],
      };
    },
    watch: {
      password: {
        deep: true,
        immediate: true,
        handler(newVal) {
          let password = this.$lfind(this.fields, {path: 'password'});
          password.attrs.type = newVal;

          let confirm_password = this.$lfind(this.fields, {path: 'confirm_password'});
          confirm_password.attrs.type = newVal;
        },
      },
    },
    computed: {
      password() {
        return this.isPwd ? 'password' : 'text';
      },
    },
    methods: {
      keyupEnter(key, event) {
        if (event.key === 'Enter') {
          if (key === 'confirm_password') {
            this.resetPassword();
          }
        }
      },
      resetPassword() {
        if (this.formData.confirm_password !== this.formData.password) {
          this.$q.notify({
            icon: 'fas fa-minus-square',
            message: 'Passwords do not match',
            color: 'negative',
          });
          return;
        }
        this.$q.loading.show();
        axios.post(process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030' + '/authManagement', {
          action: 'resetPwdLong',
          value: {
            oldPassword: this.formData.old_password,
            password: this.formData.password,
          },
          notifierOptions: {
            link_source: this.$lget(this.$route, 'query.link_source', undefined),
          },
        }).then((res) => {
          this.$q.loading.hide();
          console.log(res);
          this.$router.push('/login');
        }).catch((err) => {
          this.$q.loading.hide();
          this.error = true;
          console.log(err);
        });
      },
    },
  };
</script>

<style scoped>

</style>
