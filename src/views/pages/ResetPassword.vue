<!-- =========================================================================================
    File Name: ResetPassword.vue
    Description: Reset Password Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-col sm:w-3/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row">
                        <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                            <img src="@/assets/images/pages/reset-password.png" alt="login" class="mx-auto">
                        </div>
                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center  d-theme-dark-bg">
                            <div class="p-8">
                              <vs-alert :color="status" title="Message" :active="show">{{message}}</vs-alert>
                                <div class="vx-card__title mb-8">
                                    <h4 class="mb-4">Reset Password</h4>
                                    <p>Please enter your new password.</p>
                                </div>
                                <vs-input type="email" label-placeholder="Email" v-validate="'required|email'" name="email"  autocomplte="new-password" v-model="data.email" class="w-full mb-6" />
                              <span class="text-danger text-sm" v-show="errors.has('email')">{{ errors.first('email') }}</span>
                                <vs-input type="password" label-placeholder="Password" v-validate="'required'" name="password"  v-model="data.password" class="w-full mb-6" ref="password" />
                              <span class="text-danger text-sm" v-show="errors.has('password')">{{ errors.first('password') }}</span>
                                <vs-input type="password" label-placeholder="Confirm Password" name="password_confirmation" v-validate="'required|confirmed:password'" data-vv-as="password"  v-model="data.password_confirmation" class="w-full mb-8" />
                              <span class="text-danger text-sm" v-show="errors.has('password_confirmation')">{{ errors.first('password_confirmation') }}</span>
                                <div class="flex flex-wrap justify-between flex-col-reverse sm:flex-row">
                                    <vs-button type="border" to="/login" class="w-full sm:w-auto mb-8 sm:mb-auto mt-3 sm:mt-auto">Go Back To Login</vs-button>
                                    <vs-button @click="reset" :disable="!data.token" class="w-full sm:w-auto">Reset</vs-button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
          data:{
            token: this.$route.params.token,
            password:'',
            password_confirmation: '',
            email: this.$route.query.email,
          },
          status:'',
          message:'',
          show:false,
        }
    },
    methods:{
      reset(){
        if (!this.data.token){
          this.$vs.notify({
            title: 'Invalid Url/token',
            text:'Please verify that you have correct reset link.',
            color:'danger',
          })
        }else {
          this.$validator.validateAll().then(result => {
            if (result) {
              this.axios.post('auth/reset-password', this.data).then(
                res => {
                  this.status = res.data.status;
                  this.message = res.data.message;
                  this.show = true;
                }
              )
            }
          })
        }
      }
    },
}
</script>
