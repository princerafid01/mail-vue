/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import App from './App.vue'

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css'; // Vuesax
Vue.use(Vuesax)



// Theme Configurations
import '../themeConfig.js'


// Globally Registered Components
import './globalComponents.js'


// Styles: SCSS
import './assets/scss/main.scss'


// Tailwind
import '@/assets/css/main.css';


// Vue Router
import router from './router'


// Vuex Store
import store from './store/store'


// Vuesax Admin Filters
import './filters/filters'


// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)


// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);


// Feather font icon
require('./assets/css/iconfont.css')
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'

Vue.use(VueAxios, axios)
axios.defaults.baseURL = 'http://laravel.localhost.com/api';
Vue.router  = router;
Vue.use(VueAuth, {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js')
});

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
  mounted(){
      const notify = this.$vs.notify;
    this.axios.interceptors.response.use(function (response) {
      return response;
    }, function (error) {
      if (error.response.status == 422){
        notify ({
          title:'Validation error',
          text:'Error in your data.Please check your input',
          color:'warning'});
        for(var key in error.response.data.errors) {
          notify ({
            title:key,
            text:error.response.data.errors[key][0],
            color:'warning'});
        }
      } else if (error.response.status == 403){
        notify ({
          title:'Unauthorised Access !',
          text:'You are not authorized for some information.',
          color:'danger'})
      } else if (error.response.status == 404){
        notify ({
          title:'Not found !',
          text:'Requested information not found',
          color:'warning'})
      } else {
        notify ({
          title:'Some thing went wrong',
          text:'Request was not succesful',
          color:'warning'})
      }
      console.log(error.response);
      return Promise.reject(error);
    });
  }
}).$mount('#app')
