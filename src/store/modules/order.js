import {SET_DATE, ADD_BOOKING,SET_COMPANY, ADD_DEPOSIT ,SET_PAYTYPE, REPLACE_BOOKING, SET_CLIENT, SET_ORDER, SET_TYPE, SET_BOOKINGDISCOUNT, SET_STATUS, UPDATE_ORDER} from '../mutation-types.js'
const getDefaultState = ()=>{
  return {
    order: {
      booking: [],
      client: {
        id: null,
        firstname:'',
        lastname: '',
        phone: '',
        is_temporary: null,
        avatar: ''
      },
      company: '',
      payment_type: 'cash',
      start_date: '',
      end_date: '',
      type: 0,
      status: 'pending',
      deposit: 0,
      total_discount: 0,
      total_price: 0,
      paid: 0,
      debt: 0,
      residue: 0
    }
  }
}
const orderModule = {
    namespaced: true,
  state: ()=> getDefaultState(),
  getters: {
    getAllDiscount: (state)=>{
      return state.order.booking.filter(e=>e.status!=='canceled').reduce((acc, curr)=>acc+parseInt(curr.discount), 0);
    },
    getAllCost: (state)=>{
      return state.order.booking.filter(e=>e.status!=='canceled').reduce((acc, curr)=>acc+parseInt(curr.price), 0);
    },
    getAllPaid: (state)=>{
      return state.order.booking.filter(e=>e.status!=='canceled').reduce((acc, curr)=>acc+parseInt(curr.paid), 0);
    },
    getRemainMoney: (state, getters)=>{
      return getters.getAllCost-getters.getAllDiscount-getters.getAllPaid;
    },
    getStatus: (state)=>{
      switch(state.status){
          case 'completed': 
              return 'Завершен';
          case 'canceled': 
              return 'Отменен';
          case 'pending': 
              return 'В ожидании';
          case 'activated': 
              return 'Потвержден';
      }
    },
    getOrder: (state)=>{
      return state.order;
    },
    getClient: (state)=>{
      return state.order.client;
    }
  },
  mutations: {
    [SET_DATE](state, date){
      state.order = {...state.order, start_date: date.start_date, end_date: date.end_date}
    },
    [SET_COMPANY](state, company){
      state.order = {...state.order, company: company}
    },
    [ADD_BOOKING](state, booking){
      state.order = {...state.order, booking: [booking]}
    },
    [SET_PAYTYPE](state, pt){
      state.order = {...state.order, payment_type: pt}
    },
    [SET_CLIENT](state, client){
      state.order = {...state.order, client: {...client}}
    },
    [ADD_DEPOSIT](state, deposit){
      state.order = {...state.order, deposit: deposit}
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
    [UPDATE_ORDER](state, order){
      state.order = {...state.order, ...order}
    },
    [REPLACE_BOOKING](state, booking){
      state.order = {...state.order, booking: booking}
    },
    [SET_BOOKINGDISCOUNT](state, discount){
      const newBookings = state.order.booking.map(element => {
        return {...element, discount: discount}
      });
      state.order = {...state.order, booking: newBookings}
    },
    resetState(state){
      Object.assign(state, getDefaultState())
  }
  },
  actions: {
    resetState({commit}){
      commit('resetState');
    },
    setCompany({commit}, company){
      commit(SET_COMPANY, company);
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
    setStatus({commit}, status){
      commit(SET_STATUS, status)
    },
    setBookingDiscount({commit}, discount){
      commit(SET_BOOKINGDISCOUNT, discount)
    },
    addDeposit({commit}, deposit){
      commit(ADD_DEPOSIT, deposit);
    },
    setOrder({commit}, order){
      commit(SET_ORDER, order)
    },
    replaceBooking({commit}, booking){
      commit(REPLACE_BOOKING, booking)
    },
    updateOrder({commit}, order){
      commit(UPDATE_ORDER, order);
    }
  }
};
export default orderModule;