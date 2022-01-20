import Vuex from 'vuex'
import Vue from 'vue'
import bookingModule from './modules/booking';
import orderModule from './modules/order';
import facilityModule from './modules/facility'
import playfieldModule from './modules/playfield'
import adminModule from './modules/admin'
import spinnerModule from './modules/spinner'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    order: orderModule,
    booking: bookingModule,
    facility: facilityModule,
    playfield: playfieldModule,
    admin: adminModule,
    spinner: spinnerModule
  }
})
export default store;