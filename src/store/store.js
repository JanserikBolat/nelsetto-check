import Vuex from 'vuex'
import Vue from 'vue'
import bookingModule from './modules/booking';
import orderModule from './modules/order';
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    order: orderModule,
    booking: bookingModule
  }
})
export default store;