import {SET_DATE, ADD_BOOKING, SET_ID,SET_PAYTYPE, REPLACE_BOOKING, SET_CLIENT, SET_ORDER, SET_TYPE, SET_BOOKINGDISCOUNT, SET_STATUS} from '../mutation-types.js'
const getDefaultState = ()=>{
  return {
    order: {
      bookings: [],
      client: {
        client_name:'',
        client_surname: '',
        client_tel: '',
        company: ''
      },
      orderId: '',
      pay_type: 'cash',
      start_date: '',
      end_date: '',
      type: 'Разовая бронь',
      status: 'В ожидании'
    }
  }
}
const orderModule = {
    namespaced: true,
  state: ()=> getDefaultState(),
  getters: {
    getAllDiscount: (state)=>{
      return state.order.bookings.reduce((acc, curr)=>acc+curr.booking_discount, 0);
    },
    getAllCost: (state)=>{
      return state.order.bookings.reduce((acc, curr)=>acc+curr.price, 0);
    },
    getAllPaid: (state)=>{
      return state.order.bookings.reduce((acc, curr)=>acc+curr.paid, 0);
    },
    getRemainMoney: (state, getters)=>{
      return getters.getAllCost-getters.getAllDiscount-getters.getAllPaid;
    },
    getOrder: (state)=>{
      return {...state.order, start_date: state.order.start_date, end_date: state.order.end_date}
    },
    getClient: (state)=>{
      return state.order.client
    },
    getBookings: (state)=>{
      return state.order.bookings
    }
  },
  mutations: {
    [SET_DATE](state, date){
      state.order = {...state.order, start_date: date.start_date, end_date: date.end_date}
    },
    [ADD_BOOKING](state, booking){
      state.order = {...state.order, bookings: [...state.order.bookings, booking]}
    },
    [SET_ID](state, id){
      state.order = {...state.order, orderId: id}
    },
    [SET_PAYTYPE](state, pt){
      state.order = {...state.order, pay_type: pt}
    },
    [SET_CLIENT](state, client){
      state.order = {...state.order, client: {...client}}
    },
    [SET_TYPE](state, type){
      state.order = {...state.order, type: type}
    },
    [SET_STATUS](state, status){
      state.order = {...state.order, status: status}
    },
    [SET_ORDER](state, order){
      state.order = {...order}
    },
    [REPLACE_BOOKING](state, booking){
      state.order = {...state.order, bookings: booking}
    },
    [SET_BOOKINGDISCOUNT](state, discount){
      const newBookings = state.order.bookings.map(element => {
        return {...element, booking_discount: discount}
      });
      state.order = {...state.order, bookings: newBookings}
    },
    resetState(state){
      Object.assign(state, getDefaultState())
  }
  },
  actions: {
    resetState({commit}){
      commit('resetState');
    },
    setType({commit}, type){
      commit(SET_TYPE, type);
    },
    setDate({commit}, date){
      commit(SET_DATE, date);
    },
    addBooking({commit}, booking){
      commit(ADD_BOOKING, booking);
    },
    setClient({commit}, client){
      commit(SET_CLIENT, client)
    },
    setPayType({commit}, pt){
      commit(SET_PAYTYPE, pt)
    },
    setId({commit}, id){
      commit(SET_ID, id)
    },
    setStatus({commit}, status){
      commit(SET_STATUS, status)
    },
    setBookingDiscount({commit}, discount){
      commit(SET_BOOKINGDISCOUNT, discount)
    },
    setOrder({commit}, order){
      commit(SET_ORDER, order)
    },
    replaceBooking({commit}, booking){
      commit(REPLACE_BOOKING, booking)
    }
  }
};
export default orderModule;