/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import router from '@/router'
import axios from 'axios'
axios.defaults.baseURL = 'http://d.localhost.com/api/';

export default {
    loginAttempt({ dispatch }, payload) {

        // New payload for login action
        const newPayload = {
            userDetails: payload.userDetails,
            notify: payload.notify
        }

        // If remember_me is enabled change firebase Persistence
        // if (!payload.checkbox_remember_me) {
        //
        //     // Change firebase Persistence
        //     firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        //
        //         // If success try to login
        //         .then(function() {
        //             dispatch('login', newPayload)
        //         })
        //
        //         // If error notify
        //         .catch(function(err) {
        //             payload.notify({
        //                 time: 2500,
        //                 title: 'Error',
        //                 text: err.message,
        //                 iconPack: 'feather',
        //                 icon: 'icon-alert-circle',
        //                 color: 'danger'
        //             });
        //         });
        // } else {
            // Try to login
            dispatch('login', newPayload)
        // }
    },
    login({ commit, state, dispatch }, payload) {

        // If user is already logged in notify and exit
        if (state.isUserLoggedIn()) {
            payload.notify({
                title: 'Login Attempt',
                text: 'You are already logged in!',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'warning'
            });
            return false
        }

        // Try to sigin
        axios.post('/login', {email: payload.userDetails.email, password:payload.userDetails.password},)
            .then(res => {
                if (res.status === 200){
                    payload.notify({
                        title: 'Login Attempt',
                        text: 'You are successfully logged in!',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    });
                    dispatch('localLogin', res.data)
                }else{

                }
            },(err) => {
            payload.notify({
                time: 2500,
                title: 'Error',
                text: err.message,
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger'
            })
            });
    },
    logout({ commit, state, dispatch }){
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('permissions');
        localStorage.removeItem('role');
        router.push('/login');
    },

    localLogin({ commit, state, dispatch },authResult) {
        // Convert the JWT expiry time from seconds to milliseconds
        let tokenExpiry = new Date();
        tokenExpiry.setSeconds(tokenExpiry.getSeconds() + authResult.expires_in)
        console.log(tokenExpiry);
        localStorage.setItem('tokenExpiry', tokenExpiry);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('role', JSON.stringify(authResult.role))
        localStorage.setItem('permissions', JSON.stringify(authResult.permissions))
        localStorage.setItem('userInfo', JSON.stringify({
            displayName: authResult.user.name,
            email: authResult.user.email,
            photoURL: '',
            providerId: 'p_id',
            uid: authResult.user.id
        }));
        if (router.currentRoute.query.to){
            router.push(router.currentRoute.query.to);
        } else{
            router.push('/');
        }

    },
    registerUser({dispatch}, payload) {

        // create user using firebase
        firebase.auth().createUserWithEmailAndPassword(payload.userDetails.email, payload.userDetails.password)
            .then(() => {
                payload.notify({
                    title: 'Account Created',
                    text: 'You are successfully registered!',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    color: 'success'
                });

                const newPayload = {
                    userDetails: payload.userDetails,
                    notify: payload.notify,
                    updateUsername: true
                }
                dispatch('login', newPayload)
            }, (error) => {
                payload.notify({
                    title: 'Error',
                    text: error.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            })
    },
    updateUsername({ commit }, payload) {
        payload.user.updateProfile({
            displayName: payload.username
        }).then(() => {

            // If username update is success
              // update in localstorage
            let newUserData = Object.assign({}, payload.user.providerData[0])
            newUserData.displayName = payload.username
            commit('UPDATE_AUTHENTICATED_USER', newUserData)

            // If reload is required to get fresh data after update
              // Reload current page
            if(payload.isReloadRequired) {
                router.push(router.currentRoute.query.to || '/')
            }
        }).catch((err) => {
              payload.notify({
                time: 8800,
                title: 'Error',
                text: err.message,
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger'
            });
        })
    },
    updateAuthenticatedUser({ commit }, payload) {
        commit('UPDATE_AUTHENTICATED_USER', payload)
    }
}
