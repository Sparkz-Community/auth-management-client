<template>
  <div id="OAuthRegisterForm">
    <q-card v-if="registered === true" class="q-pa-xl text-h6">
      <div>
        An email has been sent to <span class="text-weight-bold text-primary">{{ user.email }}</span> to verify your
        account.
      </div>
    </q-card>
    <div v-else>
      <q-card class="mainCard" :flat="cardFlat" :dark="cardDark">
        <div>
          <q-avatar size="75px" color="primary" text-color="white" :icon="headerIcon" class="floatingIcon"/>
        </div>
        <q-card-section class="flex items-end justify-center q-mb-md"
                        :class="cardDark ? 'headerSectionDark' : 'headerSectionLight'">
          <span class="mainFont q-mb-md" style="font-size: 1.3em;font-weight: 400;">{{ headerText }}</span>
        </q-card-section>
        <div class="q-pt-xs"
             style="height: 50%;display: flex; justify-content: space-evenly;flex-direction: column;align-items: center;">
          <div class="inputWrapper">
            <label for="email" class="inputFont q-pb-sm" style="width: 95%;">EMAIL ADDRESS</label>
            <input type="email" v-model="user.email" name="email" id="email" style="width: 95%;"
                   :style="error ? 'border: 1px solid var(--q-color-negative);' : ''" @update:modelValue="checkEmail"/>
          </div>
          <div style="width: 95%;">
            <div
                style="width: 100%;display: flex; justify-content: center;position: relative;flex-direction: column;align-items: center;">
              <label for="password" class="inputFont q-pb-sm" style="width: 95%;">PASSWORD</label>
              <input :type="isPasswordType ? 'text' : 'password'" v-model="user.password" name="password" id="password"
                     style="width: 95%;" @keyup.enter="register"
              />
              <q-icon :name="isPasswordType ? 'visibility' : 'visibility_off'"
                      class="q-mr-sm cursor-pointer passwordIcon"
                      @click.stop="isPasswordType = !isPasswordType"></q-icon>
            </div>
            <div
                style="width: 100%;display: flex; justify-content: center;position: relative;flex-direction: column;align-items: center;">
              <label for="confirmPassword" class="inputFont q-py-sm" style="width: 95%;">CONFIRM PASSWORD</label>
              <input :type="isPasswordType ? 'text' : 'password'" v-model="passwordConfirmation" name="confirmPassword"
                     id="confirmPassword"
                     style="width: 95%;" @keyup.enter="register"
                     :style="passwordsMatch ? 'border: 1px solid var(--q-color-negative);' : ''"/>
            </div>
          </div>
          <transition name="fade">
            <div v-if="passwordsMatch" class="mainFont" style="font-size: 0.9em;color: var(--q-color-negative);">
              Password must match.
            </div>
          </transition>
          <transition name="fade">
            <div v-if="error" class="mainFont" style="font-size: 0.9em;color: var(--q-color-negative);">
              {{ errorText }}
            </div>
          </transition>
          <div class="flex justify-center" style="width: 100%;">
            <button class="logInButton q-mt-xs cursor-pointer" @click="register" id="loginButton"
                    :disabled="disableButton"><span>Register</span>
              <q-inner-loading :showing="loading">
                <q-spinner
                    color="primary"
                    size="3em"
                    :thickness="2"
                />
              </q-inner-loading>
            </button>
          </div>
        </div>
        <OAuthLinks :social-links="socialLinks" :top="true" line-size="25%" :social-box-size="['30%', '60px']" :social-link-image-size="['40px', 'auto']"></OAuthLinks>
      </q-card>
      <div class="row flex justify-between q-mt-sm">
        <div class="inputFont cursor-pointer" @click="$router.push('/login')">
          Already have an account?
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'pinia';
  import useAuthStore from '../../../stores/store.auth';
  import {models} from 'feathers-pinia';
  import OAuthLinks from '../../../components/OAuthLinks/OAuthLinks';
  import {LodashMixin} from '../../../mixins';

  const isEmailRule = (val) => {
    let reg = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
    return !reg.test(val);
  };

  export default {
    name: 'OAuthRegisterForm',
    mixins: [
      LodashMixin({methodsToAdd: ['$lget']}),
    ],
    created() {
      if (this.$route.hash.includes('error')) {
        this.error = true;
        this.errorText = 'A user already exists with that email.';
      } else if (this.$lget(this.$store, 'getters.auth/isAuthenticated', false)) {
        this.$router.push('/');
      }
    },
    components: {
      OAuthLinks
    },
    props: {
      headerIcon: {
        type: String,
        default: 'fas fa-user-circle',
      },
      headerText: {
        type: String,
        default: 'Create an account to Sign In',
      },
      facebook: {
        type: Boolean,
        default: true,
      },
      google: {
        type: Boolean,
        default: true,
      },
      emitValues: {
        type: Boolean,
        default: false,
      },
      customLinks: {
        type: Array,
      },
      cardFlat: {
        type: Boolean,
        default: false,
      },
      cardDark: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        errorText: '',
        error: false,
        loading: false,
        isPasswordType: false,
        disableButton: false,
        passwordConfirmation: '',
        registered: false,
        user: {
          email: '',
          password: '',
        },
        possibleLinks: [
          {
            name: 'Google',
            icon: 'mdi-google',
            img: 'https://rayraysolarstatic.s3-us-west-1.amazonaws.com/Google__G__Logo.svg.png',
            color: 'red',
            link: `${process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030'}/oauth/google`
          },
          {
            name: 'Facebook',
            icon: 'mdi-facebook',
            color: '#2090E1',
            link: `${process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030'}/oauth/facebook`
          },
        ]
      };
    },
    computed: {
      passwordsMatch() {
        return this.user.password !== this.passwordConfirmation;
      },
      socialLinks() {
        let arr = [];
        if (this.google) {
          arr.push(this.possibleLinks[0]);
        }
        if (this.facebook) {
          arr.push(this.possibleLinks[1]);
        }
        if (this.customLinks) {
          arr.concat(this.customLinks);
        }
        return arr;
      },
    },
    methods: {
      ...mapActions(useAuthStore, {
        auth: 'authenticate'
      }),
      checkEmail() {
        if (!isEmailRule(this.user.email)) {
          this.error = false;
          this.disableButton = false;
        } else {
          this.disableButton = true;
          this.error = true;
          this.errorText = 'Must be a valid email';
        }
      },
      register() {
        if (!this.emitValues) {
          let userToCreate = new models.api.Users({...this.user});
          this.loading = true;
          setTimeout(() => {
            userToCreate.save({verify_methods: 'email'}).then(() => {
              this.auth({...this.user, strategy: 'local'}).then(() => {
                this.registered = true;
                this.$q.notify({
                  type: 'positive',
                  message: `Successfully created account, welcome ${this.user.email}`
                });
              });
            }).catch(() => {
              this.loading = false;
              this.errorText = 'Email is already in use.';
              this.error = true;
              let button = document.getElementById('loginButton');
              button.classList.add('shake');
              setTimeout(() => {
                button.classList.remove('shake');
              }, 800);
            });
          }, 500);
        } else {
          this.$emit('submit', this.user);
        }
      }
    }
  };
</script>

<style scoped lang="scss" src="./_OAuthRegisterForm.scss">

</style>
