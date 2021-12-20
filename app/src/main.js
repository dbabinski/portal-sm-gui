import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import vuetify from './plugins/vuetify'
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

import  { isNull }  from '@/lib/utils';
import  { getJSON } from '@/lib/cookies';
import './permissions';


Vue.config.productionTip = false



new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  render: h => h(App),

  data: {
    logged: false,
    recaptchaReady: false,
  },
  
  created() {
    document.body.addEventListener("submit", async function(event) {
      event.preventDefault();
    });

    this.$store.subscribe((mutation, state) => {
      if (mutation == 'user/initialiseStore' || mutation.type == "user/login" || mutation.type == "user/logout") {
          localStorage.setItem("sm-portal.store", JSON.stringify(state));
      }
    });
    this.$store.commit('user/initialiseStore');
    this.checkLogin()
    // let check = setInterval(function() {
    //   self.checkLogin();
    // }, 5000);
  },

  methods: {
    toast() {
      // this.$refs.toast.show(message);
      // add message to parameter
    },

    handleErrors(response) {
      if (!response.ok) {
        if (response.status == "401") {
          self.logout();
        }
        throw Error(response.statusText + " " + response.url);
      }
      return response;
    },

    logout() {
      const self = this;
      fetch("/sm-portal-server/autentykacja/logout")
        .then(res => {
          store.dispatch("user/logout");
          router.push("/");
          self.logged = false;
          return res.json();
          })
        .then(json => {
            self.toast(json.komunikat);
        })
        .catch(error => {
            console.log(error);
        }); 
    },
    checkLogin() {
      let cookie = getJSON();
      if(isNull(cookie)) {
        this.logged = false;
        if(store.getters.isLogged) {
          store.dispatch("user/logout");
          router.push("/");
        }
      } else {
        this.logged = true;
        if(!store.getters.isLogged) {
          store.dispatch("user/login", {
            email: cookie.email,
            permissions: cookie.permissions
          });
        }
      }
    },
    newAccount() {
      this.getDialogLogin().addItemSelf();
    }
  }

}).$mount('#app')
