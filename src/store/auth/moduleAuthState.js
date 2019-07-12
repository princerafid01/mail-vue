/*=========================================================================================
  File Name: moduleAuthState.js
  Description: Auth Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/



export default {
    isUserLoggedIn: () => {
        let isAuthenticated = false;
        if (new Date(Date.now()) < new Date(localStorage.getItem('tokenExpiry')) && localStorage.getItem('loggedIn') === 'true') isAuthenticated = true
        else isAuthenticated = false;

        return (localStorage.getItem('userInfo') && isAuthenticated);
    },
    permissions: localStorage.getItem('permissions')? JSON.parse(localStorage.getItem('permissions')) : null,
}