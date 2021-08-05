import Vue from 'vue'
import App from './App.vue'
import router  from './router/index'
import store from './store/store'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'
import UUID from 'vue-uuid'
Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Vuelidate)
Vue.use(UUID)
new Vue({
  render: h => h(App),
  router, store: store
}).$mount('#app')
