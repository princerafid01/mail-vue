<!-- =========================================================================================
  File Name: TheNavbar.vue
  Description: Navbar component
  Component Name: TheNavbar
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
<div class="relative">
  <div class="vx-navbar-wrapper">
    <vs-navbar class="vx-navbar navbar-custom" :color="navbarColor" :class="classObj">

      <!-- SM - OPEN SIDEBAR BUTTON -->
      <feather-icon class="sm:inline-flex xl:hidden cursor-pointer mr-1" icon="MenuIcon" @click.stop="showSidebar"></feather-icon>

      <template v-if="breakpoint != 'md'">
        <!-- STARRED PAGES - FIRST 10 -->
        <ul class="vx-navbar__starred-pages">
          <draggable v-model="starredPagesLimited" :group="{name: 'pinList'}" class="flex cursor-move">
            <li class="starred-page" v-for="page in starredPagesLimited" :key="page.url">
              <vx-tooltip :text="page.label" position="bottom" delay=".3s">
                <feather-icon svgClasses="h-6 w-6" class="p-2 cursor-pointer" :icon="page.labelIcon" @click="$router.push(page.url)"></feather-icon>
              </vx-tooltip>
            </li>
          </draggable>
        </ul>

        <!-- STARRED PAGES MORE -->
        <div class="vx-navbar__starred-pages--more-dropdown" v-if="starredPagesMore.length">
          <vs-dropdown vs-custom-content vs-trigger-click>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" class="cursor-pointer p-2"></feather-icon>
            <vs-dropdown-menu>
              <ul class="vx-navbar__starred-pages-more--list">
                <draggable v-model="starredPagesMore" :group="{name: 'pinList'}" class="cursor-move">
                  <li class="starred-page--more flex items-center cursor-pointer" v-for="page in starredPagesMore" :key="page.url" @click="$router.push(page.url)">
                    <feather-icon svgClasses="h-5 w-5" class="ml-2 mr-1" :icon="page.labelIcon"></feather-icon>
                    <span class="px-2 pt-2 pb-1">{{ page.label }}</span>
                  </li>
                </draggable>
              </ul>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>

        <div class="bookmark-container">
          <feather-icon icon="StarIcon" :svgClasses="['stoke-current text-warning', {'text-white': navbarColor != '#fff'}]" class="cursor-pointer p-2" @click.stop="showBookmarkPagesDropdown = !showBookmarkPagesDropdown" />
                    <div v-click-outside="outside" class="absolute bookmark-list w-1/3 xl:w-1/4 mt-4" v-if="showBookmarkPagesDropdown">
          <vx-auto-suggest :autoFocus="true" :data="navbarSearchAndPinList" @selected="selected" @actionClicked="actionClicked" inputClassses="w-full" show-action show-pinned background-overlay></vx-auto-suggest>
          </div>
        </div>
      </template>


      <vs-spacer></vs-spacer>

            <!-- SEARCHBAR -->
            <div class="search-full-container w-full h-full absolute left-0 rounded-lg" :class="{'flex': showFullSearch}" v-show="showFullSearch">
                <vx-auto-suggest :autoFocus="showFullSearch" :data="navbarSearchAndPinList" @selected="selected" ref="navbarSearch" @closeSearchbar="showFullSearch = false" placeholder="Search..." class="w-full" inputClassses="w-full vs-input-no-border vs-input-no-shdow-focus no-icon-border" icon="SearchIcon" background-overlay></vx-auto-suggest>
                <div class="absolute right-0 h-full z-50">
                    <feather-icon icon="XIcon" class="px-4 cursor-pointer h-full close-search-icon" @click="showFullSearch = false"></feather-icon>
                </div>
            </div>

      <!-- NOTIFICATIONS -->
      <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer ml-4">
        <feather-icon icon="BellIcon" class="cursor-pointer mt-1 sm:mr-6 mr-2" badge_bg="bg-danger" :badge="unread"></feather-icon>
        <vs-dropdown-menu class="notification-dropdown dropdown-custom vx-navbar-dropdown">

          <div class="notification-top text-center p-5 bg-primary text-white">
            <h3 class="text-white">{{unread }} New</h3>
            <vs-chip class="float-right" style="cursor: pointer" v-if="unread" color="success"><span @click="markAllRead">Mark all read</span></vs-chip>
          </div>

          <VuePerfectScrollbar @ps-y-reach-end="onScroll" ref="mainSidebarPs" class="scroll-area--nofications-dropdown p-0 mb-10" :settings="settings">
          <ul @scroll="onScroll" class="bordered-items">
            <li v-for="(ntf, index) in notifications" :key="ntf.id" @click="markRead(index, ntf.id, ntf.read_at); handleN(ntf.data);" class="flex justify-between px-4 py-4 notification cursor-pointer">
              <div class="flex items-start">
                <feather-icon :icon="ntf.data.icon" :svgClasses="[ntf.read_at == ''?'text-danger':'text-success', 'stroke-current mr-1 h-6 w-6']"></feather-icon>
                <div class="mx-2">
                  <span class="font-medium block notification-title" :class="[ntf.read_at == null?'text-danger':'text-success']">{{ ntf.data.msg}}</span>
                </div>
              </div>
              <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.created_at) }}</small>
            </li>
          </ul>
          </VuePerfectScrollbar>
        </vs-dropdown-menu>
      </vs-dropdown>

      <!-- USER META -->
      <div class="the-navbar__user-meta flex items-center">
        <div class="text-right leading-tight hidden sm:block">
          <p class="font-semibold">{{ $auth.user().name }}</p>
          <small>{{$auth.user().role.display_name}}</small>
        </div>
        <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
          <div class="con-img ml-3">
            <img
              v-if="activeUserImg.startsWith('http')"
              key="onlineImg"
              :src="activeUserImg"
              alt="user-img"
              width="40"
              height="40"
              class="rounded-full shadow-md cursor-pointer block" />
            <img
              v-else
              key="localImg"
              :src="require(`@/assets/images/portrait/small/${activeUserImg}`)"
              alt="user-img"
              width="40"
              height="40"
              class="rounded-full shadow-md cursor-pointer block" />
          </div>
          <vs-dropdown-menu class="vx-navbar-dropdown">
            <ul style="min-width: 9rem">
              <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="$router.push('/pages/profile')"><feather-icon icon="UserIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">Profile</span></li>
              <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="$router.push('/apps/email')"><feather-icon icon="MailIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">Inbox</span></li>
              <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" v-if="$store.state.theme == 'semi-dark'" @click="setTheme('dark')"><feather-icon icon="MoonIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">Dark</span></li>
              <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" v-if="$store.state.theme == 'dark'"  @click="setTheme('semi-dark')"><feather-icon icon="SunIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">Light</span></li>
              <vs-divider class="m-1"></vs-divider>
              <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="logout"><feather-icon icon="LogOutIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">Logout</span></li>
            </ul>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

    </vs-navbar>
  </div>
  <div class="demo-alignment">
    <vs-popup class="holamundo" fullscreen title="View Trip" :active.sync="showTrip">
      <div id="section-to-print">
        <trip-view :tripData="tripData" v-if="tripData"></trip-view>
      </div>
    </vs-popup>
  </div>
  <div class="demo-alignment">
    <vs-popup class="holamundo" :title="transaction.type == 'gexpense'? 'General Expense': transaction.type" v-if="transaction" :active.sync="activePrompt">
      <table style="width:100%" class="border-collapse">
        <tr>
          <td class="p-2 border border-solid d-theme-border-grey-light">Type</td>
          <td class="p-2 border border-solid d-theme-border-grey-light">{{transaction.type == 'gexpense'? 'General Expense': transaction.type}}</td>
        </tr>
        <tr>
          <td class="p-2 border border-solid d-theme-border-grey-light">Date</td>
          <td class="p-2 border border-solid d-theme-border-grey-light">{{transaction.created_at | formatDate}}</td>
        </tr>
        <tr>
          <td class="p-2 border border-solid d-theme-border-grey-light">Amount</td>
          <td class="p-2 border border-solid d-theme-border-grey-light">{{transaction.amount | currency}}</td>
        </tr>
        <tr>
          <td class="p-2 border border-solid d-theme-border-grey-light">Created By</td>
          <td class="p-2 border border-solid d-theme-border-grey-light">{{transaction.created_by.name}}</td>
        </tr>
      </table>
    </vs-popup>
  </div>
</div>
</template>

<script>
import VxAutoSuggest from '@/components/vx-auto-suggest/VxAutoSuggest.vue';
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import draggable from 'vuedraggable'
import TripView from '../../views/components/TripView';

export default {
    name: "the-navbar",
    props: {
        navbarColor: {
            type: String,
            default: "rgb(115, 103, 240)",
        },
    },
    data() {
        return {
            transaction:null,
            take:0,
            navbarSearchAndPinList: this.$store.state.navbarSearchAndPinList,
            searchQuery: '',
            showFullSearch: false,
            unread:0,
            activePrompt:false,
            showTrip:false,
            tripData:null,
            loading:false,
            notifications:[
            ],
            settings: { // perfectscrollbar settings
                maxScrollbarLength: 60,
                wheelSpeed: .60,
            },
            autoFocusSearch: false,
            showBookmarkPagesDropdown: false,
        }
    },
    watch: {
        '$route'() {
            if (this.showBookmarkPagesDropdown) this.showBookmarkPagesDropdown = false
        }
    },
    computed: {
        // HELPER
        sidebarWidth() {
            return this.$store.state.sidebarWidth;
        },
        breakpoint() {
            return this.$store.state.breakpoint;
        },

        // NAVBAR STYLE
        classObj() {
            if (this.sidebarWidth == "default") return "navbar-default"
            else if (this.sidebarWidth == "reduced") return "navbar-reduced"
            else if (this.sidebarWidth) return "navbar-full"
        },

        // BOOKMARK & SEARCH
        data() {
            return this.$store.state.navbarSearchAndPinList;
        },
        starredPages() {
            return this.$store.state.starredPages;
        },
        starredPagesLimited: {
            get() {
                return this.starredPages.slice(0, 10);
            },
            set(list) {
                this.$store.dispatch('arrangeStarredPagesLimited', list);
            }
        },
        starredPagesMore: {
            get() {
                return this.starredPages.slice(10);
            },
            set(list) {
                this.$store.dispatch('arrangeStarredPagesMore', list);
            }
        },

        // PROFILE
        user_displayName() {
            return "john_doe"
            // return JSON.parse(localStorage.getItem('userInfo')).displayName
        },
        activeUserImg() {
            return this.$store.state.AppActiveUser.img;
        }
    },
    methods: {
        setTheme(theme){
          this.$store.commit('SET_THEME', theme);
          localStorage.setItem('theme', theme);
        },
        markRead(index, id,read){
          if (read == null){
            this.axios.get('mark_read/'+id)
              .then( res => {
                this.notifications[index].read_at = 'read'
              })
            this.unread-=1;
          }
        },
        handleN(n){
            if (n.action){
              console.log(n);
              if (n.modal === 'trip'){
                console.log('bd');
                this.showTripFn(n.action);
              }
              if (n.modal == 'transaction'){
                this.axios.get('transaction/'+n.action)
                  .then(res => {
                    this.transaction = res.data;
                    this.activePrompt = true;
                  });
              }
            }
        },
        showTripFn(tripId){
          this.axios.get('trip/'+tripId)
            .then(res => {
              this.tripData = res.data;
              this.showTrip = true;
            })
        },
        markAllRead(){
            this.axios.get('mark_all_read')
              .then(res => {
                if (res.data.notify){
                  this.unread  = 0;
                  this.notifications = [];
                  this.take = 0;
                  this.getNotifications()
                  this.$vs.notify({
                    title:res.data.notify.title,
                    text:res.data.notify.message,
                    color:res.data.notify.type
                  })
                }
              })
        },
        getNotifications(){
          if (!this.loading){
            this.loading = true;
            this.axios.get('notifications', {params:{take:this.take}})
              .then(res => {
                this.unread = res.data.unread;
                if (res.data.notifications == 'no'){
                  this.$vs.notify({
                    title:'No more notification!',
                    text:'You do not have more notification',
                    color:'warning'
                  })
                } else{
                  for(var key in res.data.notifications) {
                    this.notifications.push(res.data.notifications[key]);
                  }
                  this.take+=10;
                  this.loading = false;
                }
              })
          }
        },
        onScroll () {
            console.log('run');
            this.getNotifications();

        },
        logout(){
          var app = this
          this.$auth.logout({
            makeRequest: true,
            success: function () {},
            error: function () {},
            redirect: '/login',
          });
        },
        showSidebar() {
            this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true);
        },
        selected(item) {
            this.$router.push(item.url)
            this.showFullSearch = false;
        },
        actionClicked(item) {
            // e.stopPropogation();
            this.$store.dispatch('updateStarredPage', { index: item.index, val: !item.highlightAction });
        },
        showNavbarSearch() {
            this.showFullSearch = true;
        },
        showSearchbar() {
            this.showFullSearch = true;
        },
        elapsedTime(startTime) {
            let x = new Date(startTime);
            let now = new Date();
            var timeDiff = now - x;
            timeDiff /= 1000;

            var seconds = Math.round(timeDiff);
            timeDiff = Math.floor(timeDiff / 60);

            var minutes = Math.round(timeDiff % 60);
            timeDiff = Math.floor(timeDiff / 60);

            var hours = Math.round(timeDiff % 24);
            timeDiff = Math.floor(timeDiff / 24);

            var days = Math.round(timeDiff % 365);
            timeDiff = Math.floor(timeDiff / 365);

            var years = timeDiff;

            if (years > 0) {
                return years + (years > 1 ? ' Years ' : ' Year ') + 'ago';
            } else if (days > 0) {
                return days + (days > 1 ? ' Days ' : ' Day ') + 'ago';
            } else if (hours > 0) {
                return hours + (hours > 1 ? ' Hrs ' : ' Hour ') + 'ago';
            } else if (minutes > 0) {
                return minutes + (minutes > 1 ? ' Mins ' : ' Min ') + 'ago';
            } else if (seconds > 0) {
                return seconds > 1 ? seconds + ` sec ago` : 'Just now';
            }

            return 'Just Now'
        },
        outside: function() {
            this.showBookmarkPagesDropdown = false
        },
    },
    mounted(){
      this.getNotifications();
      Echo.connector.pusher.config.auth.headers['Authorization'] = 'Bearer '+this.$auth.token();
      Echo.private('App.User.' + this.$auth.user().id)
        .notification((notification) => {
          this.notifications.unshift(notification);
          this.unread+=1;
        });
    },
    directives: {
        'click-outside': {
            bind: function(el, binding) {
                const bubble = binding.modifiers.bubble
                const handler = (e) => {
                    if (bubble || (!el.contains(e.target) && el !== e.target)) {
                        binding.value(e)
                    }
                }
                el.__vueClickOutside__ = handler
                document.addEventListener('click', handler)
            },

            unbind: function(el) {
                document.removeEventListener('click', el.__vueClickOutside__)
                el.__vueClickOutside__ = null

            }
        }
    },
    components: {
        VxAutoSuggest,
        VuePerfectScrollbar,
        draggable,
      'trip-view':TripView
    },
}
</script>
