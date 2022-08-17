<template>
  <div id="forgotPassword" v-bind="$attrs['div-attrs']">
    <q-btn @click="forgot_password_dialog = true" v-bind="$attrs['btn-attrs']">Forgot password?</q-btn>

    <q-dialog v-model="forgot_password_dialog">
      <q-layout view="hHh Lpr fff" container :class="`bg-${$q.dark.mode ? 'dark' : 'white'} forgotPasswordSize`">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title>Forgot Password?</q-toolbar-title>

            <q-btn flat v-close-popup round dense icon="close"/>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page padding>
            <p :class="`text-${$q.dark.mode ? 'white' : 'black'}`">Find your account...</p>

            <q-select v-model="selected_search_option"
                      label="Field used to find your account"
                      use-input
                      color="accent"
                      label-color="white"
                      bg-color="secondary"
                      input-class="text-white"
                      options-selected-class="text-accent"
                      popup-content-style="background-color: var(--q-color-secondary)"
                      hide-selected
                      transition-show="flip-up"
                      transition-hide="flip-down"
                      filled
                      fill-input
                      input-debounce="0"
                      :options="search_options"
                      class="q-mb-sm"
                      hint="How should we find you in our system">
              <template v-slot:prepend>
                <q-icon name="mdi-database-search"/>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section>
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <vue-tel-input v-if="$lget(selected_search_option, 'label', '') === 'Phone'"
                           label="Phone"
                           v-model="phone_number_value"
                           :mode="'international'"
                           @update:modelValue="getPhone"
                           transition-show="flip-up"
                           transition-hide="flip-down"
                           :autocomplete="'nope'"
                           :validCharactersOnly="true"
                           :dynamicPlaceholder="true"
                           :preferredCountries="['US','CA','MX','GB']"
                           style="margin-top: 20px; height: 40px;"></vue-tel-input>
            <q-input v-else
                     v-model="search_value"
                     filled
                     bg-color="secondary"
                     label-color="white"
                     input-class="text-white"
                     color="accent"
                     :label="$lget(selected_search_option, 'label', '')"
                     bottom-slots
                     required>
              <template v-slot:prepend>
                <q-icon name="fas fa-inbox"/>
              </template>
              <template v-slot:hint>
                Enter your {{ $lget(selected_search_option, 'label', '') }} for us to search.
              </template>
            </q-input>

            <div style="text-align: right; width: 100%;">
              <q-btn class="q-mt-md"
                     @click="search"
                     :color="valid_account ? 'positive' : 'secondary'"
                     :text-color="valid_account ? 'white' : 'black'">
                <q-icon v-if="valid_account" name="done"></q-icon>
                Search
              </q-btn>
            </div>

            <div v-if="valid_account">
              <q-separator class="q-my-md"></q-separator>

              <q-select v-model="selected_notifier_options"
                        label="Where should we send the recovery info?"
                        color="accent"
                        label-color="white"
                        bg-color="secondary"
                        input-class="text-white"
                        options-selected-class="text-accent"
                        popup-content-style="background-color: var(--q-color-secondary)"
                        multiple
                        use-chips
                        transition-show="flip-up"
                        transition-hide="flip-down"
                        :options="notifier_options"
                        hint="Recovery Contact Method">
                <template v-slot:prepend>
                  <q-icon name="mdi-database-search"/>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section>
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </q-page>
        </q-page-container>

        <q-footer bordered class="bg-primary text-black">
          <q-toolbar>
            <!--              <q-toolbar-title>Footer</q-toolbar-title>-->
            <q-space></q-space>

            <q-btn color="secondary"
                   flat
                   @click="resetResetPassword">
              Cancel
            </q-btn>

            <q-btn color="accent"
                   text-color="black"
                   :disable="!valid_account || !search_value"
                   @click="sendReset">
              Send Reset
            </q-btn>
          </q-toolbar>
        </q-footer>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script>
  import {ref, watch, inject, /*reactive, toRefs, computed*/} from 'vue';
  import {useQuasar} from 'quasar';

  export default {
    name: 'forgotPassword',
    inheritAttrs: false,
    props: {
      selected_search_option_init: {
        type: Object,
        default() {
          return {
            label: 'E-mail',
            path: 'email',
          };
        },
      },
      search_options: {
        type: Array,
        default() {
          return [
            {
              label: 'E-mail',
              path: 'email',
            },
            {
              label: 'Phone',
              path: 'phone.number.e164',
            },
            {
              label: 'Username',
              path: 'username',
            },
          ];
        },
      },
    },
    // eslint-disable-next-line no-unused-vars
    setup(props) {
      const {$lget} = inject('lodash');
      const {$axios} = inject('$axios');
      const {$q} = useQuasar();

      let axiosFeathers = $axios.create({
        baseURL: process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030',
        headers: {
          ContentType: 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          // Authorization: 'Bearer ' + root.$store.state.auth.accessToken
        },
      });

      let notifier_options = ref([{label: 'E-Mail', value: 'email'}, {label: 'Text Message', value: 'sms'}]);
      let selected_notifier_options = ref([{label: 'E-Mail', value: 'email'}]);

      let selected_search_option = ref(props.selected_search_option_init);

      let phone_number_value = ref('');

      let forgot_password_dialog = ref(false);
      let search_value = ref('');
      watch(selected_search_option, (newVal, oldVal) => {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          search_value.value = '';
          phone_number_value.value = '';
        }
      }, {});

      let valid_account = ref(false);

      // eslint-disable-next-line no-unused-vars
      function getPhone(number, isValid, country) {
        search_value.value = isValid;
      }

      async function search() {
        // let hcaptcha_data = await root.$verifyHcaptcha(process.env.HCAPTCHA_SECRET, process.env.HCAPTCHA_TOKEN);
        // console.log('hcaptcha_data:', hcaptcha_data);

        let value = $lget(search_value.value, 'number.e164', search_value.value);
        const payload = {
          action: 'checkUnique',
          value: {
            [selected_search_option.value.path]: value,
          },
        };

        $q.loading.show();

        axiosFeathers.post('/authManagement', {...payload})
          .then((result) => {
            console.log('search result:', result);
            valid_account.value = false;
            $q.loading.hide();

            $q.notify({
              type: 'negative',
              message: 'Failed to locate Account!',
              timeout: 50000,
              actions: [
                {
                  icon: 'close',
                  color: 'white',
                  handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          })
          .catch(error => {
            console.log('search error:', error);
            valid_account.value = true;
            $q.loading.hide();

            $q.notify({
              type: 'positive',
              message: 'Account found!',
              timeout: 20000,
              actions: [
                {
                  icon: 'close',
                  color: 'white',
                  handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          });
      }

      function sendReset() {
        let value = $lget(search_value.value, 'number.e164', search_value.value);
        const payload = {
          action: 'sendResetPwd',
          value: {
            [selected_search_option.value.path]: value,
          },
          notifierOptions: {preferredComm: selected_notifier_options.value.map(item => item.value)},
        };

        $q.loading.show();

        axiosFeathers.post('/authManagement', {...payload})
          .then((result) => {
            console.log(`sendReset result: ${result.status} - ${result.statusText}`);
            valid_account.value = false;
            $q.loading.hide();

            $q.notify({
              type: 'positive',
              message: `Success - check your ${selected_notifier_options.value.map(item => item.label).join(', ')} at: ${search_value.value}!`,
              timeout: 20000,
              actions: [
                {
                  icon: 'close',
                  color: 'white',
                  handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          })
          .catch(error => {
            console.log('sendReset error:', error);
            valid_account.value = true;
            $q.loading.hide();

            $q.notify({
              type: 'negative',
              message: error.message,
              timeout: 50000,
              actions: [
                {
                  icon: 'close',
                  color: 'white',
                  handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          });
      }

      function resetResetPassword() {
        forgot_password_dialog.value = false;
        valid_account.value = false;
        search_value.value = '';
      }

      return {
        notifier_options,
        selected_notifier_options,
        forgot_password_dialog,
        search_value,
        valid_account,
        selected_search_option,
        phone_number_value,
        getPhone,
        search,
        resetResetPassword,
        sendReset,
      };
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // btn-attrs defaults
          this.$lset(newVal, 'btn-attrs.flat', this.$lget(newVal, 'btn-attrs.flat', true));
          this.$lset(newVal, 'btn-attrs.no-caps', this.$lget(newVal, 'btn-attrs.no-caps', true));
          this.$lset(newVal, 'btn-attrs.color', this.$lget(newVal, 'btn-attrs.color', 'primary'));

          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'hey'));
        },
      },
    },
  };
</script>

<style scoped lang="scss" src="./_forgotPassword.scss">
</style>
