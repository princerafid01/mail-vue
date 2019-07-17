/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  Object Strucutre:
                    path => router path
                    name => router name
                    component(lazy loading) => component to load
                    meta : {
                      rule => which user can have access (ACL)
                      breadcrumb => Add breadcrumb to specific page
                      pageTitle => Display title besides breadcrumb
                    }
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior () {
        return { x: 0, y: 0 }
    },
    routes: [

      {
    // =============================================================================
    // MAIN LAYOUT ROUTES
    // =============================================================================
        path: '',
        component: () => import('./layouts/main/Main.vue'),
        children: [
      // =============================================================================
      // Theme Routes
      // =============================================================================
          {
            path: '/',
            name: 'home',
            meta: {auth: true},
            component: () => import('./views/Home.vue')
          },
          {
            path: '/trips',
            name: 'trips',
            meta: {auth: {
                roles: 'trip_view',
                forbiddenRedirect: '/403'
              }},
            component: () => import('./views/trips/Trips.vue')
          },
          {
            path: '/income',
            name: 'Income',
            meta: {
              auth: {
                roles: 'income_view',
                forbiddenRedirect: '/403'
              },
              type:'income'
            },
            component: () => import('./views/transaction/Transaction.vue')
          },
          {
            path: '/expense',
            name: 'Expense',
            meta: {
              auth: {
                roles: 'expense_view',
                forbiddenRedirect: '/403'
              },
              type:'expense'
            },
            component: () => import('./views/transaction/Transaction.vue')
          },
          {
            path: '/gexpense',
            name: 'General Expense',
            meta: {
              auth: {
                roles: 'gexpense_view',
                forbiddenRedirect: '/403'
              },
              type:'gexpense'
            },
            component: () => import('./views/transaction/Transaction.vue')
          },
          {
            path: '/trip/add',
            name: 'Add Trip',
            meta: {
              auth: {
                roles: 'trip_add',
                forbiddenRedirect: '/403'
              },
            },
            component: () => import('./views/trips/TripAdd.vue')
          },
          {
            path: '/trip/edit',
            name: 'EditTrip',
            meta: {
              auth: {
                roles: 'trip_edit',
                forbiddenRedirect: '/403'
              },
            },
            component: () => import('./views/trips/TripAdd.vue')
          },
        ],
      },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
      {
        path: '',
        component: () => import('@/layouts/full-page/FullPage.vue'),
        children: [
      // =============================================================================
      // PAGES
      // =============================================================================
          {
            path: '/login',
            name: 'pageLogin',
            meta: {auth: false},
            component: () => import('@/views/pages/Login.vue')
          },
          {
            path: '/404',
            name: 'Error404',
            component: () => import('@/views/errors/Error404.vue')
          },
          {
            path: '/403',
            name: 'Error403',
            component: () => import('@/views/errors/Error403.vue')
          },
        ]
      },
      // Redirect to 404 page, if no match found
      {
        path: '*',
        redirect: '/404'
      }
    ],
})

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = "none";
    }
})

export default router
