<!-- =========================================================================================
    File Name: ForgotPassword.vue
    Description: FOrgot Password Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-col w-4/5 sm:w-4/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row">
                        <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                            <img src="@/assets/images/pages/forgot-password.png" alt="login" class="mx-auto">
                        </div>
                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg">
                            <div class="p-8">
                              <vs-alert :color="status" title="Message" :active="show">{{message}}</vs-alert>
                                <div class="vx-card__title mb-8">
                                    <h4 class="mb-4">Recover your password</h4>
                                    <p>Please enter your email address and we'll send you instructions on how to reset your password.</p>
                                </div>
                                <div>
                                  <vs-input type="email" name="email" label-placeholder="Email" v-validate="'required|email'" v-model="email" class="w-full mb-8" />
                                  <span class="text-danger text-sm" v-show="errors.has('email')">{{ errors.first('email') }}</span>
                                </div>

                                <vs-button type="border" to="/login" class="px-4 w-full md:w-auto">Back To Login</vs-button>
                                <vs-button @click="submitEmail" class="float-right px-4 w-full md:w-auto mt-3 mb-8 md:mt-0 md:mb-0">Recover Password</vs-button>
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
            email: '',
            message:'',
            status:'',
          show:false,
        }
    },
  methods:{
      submitEmail(){
        this.$validator.validateAll().then(result => {
          if(result) {
            this.axios.post('auth/forgot', {email: this.email}).then(
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
}
</script>
