<!-- =========================================================================================
	File Name: App.vue
	Description: Main vue file - APP
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Author: Pixinvent
	Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
import themeConfig from '@/../themeConfig.js'

export default {
  watch: {
    '$store.state.theme'(val) {
      this.toggleClassInBody(val);
    }
  },
  async created() {
    try {
      await this.$auth.renewTokens();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    toggleClassInBody(className) {
      if (className == 'dark') {
        if (document.body.className.match('theme-semi-dark')) document.body.classList.remove('theme-semi-dark');
        document.body.classList.add('theme-dark');
      } else if (className == 'semi-dark') {
        if (document.body.className.match('theme-dark')) document.body.classList.remove('theme-dark');
        document.body.classList.add('theme-semi-dark');
      } else {
        if (document.body.className.match('theme-dark')) document.body.classList.remove('theme-dark');
        if (document.body.className.match('theme-semi-dark')) document.body.classList.remove('theme-semi-dark');
      }
    },
    handleWindowResize(event) {
      this.$store.dispatch('updateWindowWidth', event.currentTarget.innerWidth);
    },
  },
  mounted() {
    this.toggleClassInBody(themeConfig.theme)
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize);
    });
    this.$store.dispatch('updateWindowWidth', window.innerWidth);
    if (localStorage.getItem('theme')){
      this.$store.commit('SET_THEME', localStorage.getItem('theme'));
    }
    if (localStorage.getItem('sidebar')){
      this.$store.commit('TOGGLE_REDUCE_BUTTON', JSON.parse(localStorage.getItem('sidebar')))
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
  },
}

</script>
<style>
  .floating-btn {
    position: fixed !important;
    bottom: 5%;
    right: 79px;
    z-index: 51000;
    -webkit-box-shadow: 0 1px 20px 1px #fb434f;
    box-shadow: 0 1px 20px 1px #fb434f;
  }
  .vs__search, .vs__selected-options, .vs__dropdown-toggle .vs__actions {
    cursor: pointer;
  }
  /*.only_print{*/
    /*display: none;*/
  /*}*/
  @media print {
    .vs-content-sidebar, .parentx {
      display: none;
    }
    #content-area {
      margin-left: 10px !important;
    }
    body * {
      visibility: hidden;
    }
    #section-to-print, #section-to-print * {
      visibility: visible;
    }
    .only_print{
      display: initial;
    }
    .no_print{
      display: none;
    }
    #section-to-print {
      position: absolute;
      left: 0;
      top: 0;
      /*size: A4;*/
      background: white;
      margin: 0;
    }
  }
</style>
