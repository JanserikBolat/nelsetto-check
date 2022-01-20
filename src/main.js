import Vue from 'vue'
import App from './App.vue'
import router  from './router/index'
import store from './store/store'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'
import VueCookies from 'vue-cookies';
import VueInputMask from "vue-inputmask"
Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Vuelidate)
Vue.use(VueCookies);
Vue.use(VueInputMask.default);

const url = window.location.origin.replace('playfields.', '');
new Vue({
  render: h => h(App),
  props: [url],
  router, store: store
}).$mount('#app')
