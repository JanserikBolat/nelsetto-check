import { SET_BOOKINGID, SET_BOOKINGDISCOUNT,ADD_BOOKINGDISCOUNT, SET_BOOKING, SET_BOOKINGDATE, SET_BOOKINGTIME, SET_DURATION, SET_BOOKINGFIELD, SET_BOOKINGPAID, SET_BOOKINGPRICE, SET_STATUS} from "../mutation-types";

const getDefaultState = ()=>{
    return{
        bookingId: '',
        booking_discount: 0,
        date: '',
        end_time: '',
        field_id: '',
        paid: 0,
        price: 0,
        start_time: '',
        duration: '',
        status: 'В ожидании',
    }
}
const bookingModule = {
    namespaced: true,
    state: {...getDefaultState()},
    mutations: {
        [SET_BOOKINGID](state, id){
            state.bookingId = id
        },
        [ADD_BOOKINGDISCOUNT](state, discount){
            state.booking_discount += discount 
        },
        [SET_BOOKINGDISCOUNT](state, discount){
            state.booking_discount = discount 
        },
        [SET_BOOKINGDATE](state, date){
            state.date = date
        },
        [SET_BOOKINGTIME](state, time){
            state.start_time = time.start_time
            state.end_time = time.end_time
        },
        [SET_BOOKINGFIELD](state, field_id){
            state.field_id = field_id
        },
        [SET_BOOKINGPAID](state, paid){
            state.paid+= paid
        },
        [SET_BOOKINGPRICE](state, price){
            state.price = price
        },
        [SET_DURATION](state, duration){
            state.duration = duration;
        },
        [SET_BOOKING](state, booking){
            state.bookingId = booking.bookingId
            state.booking_discount = booking.booking_discount
            state.date = booking.date 
            state.end_time = booking.end_time
            state.field_id = booking.field_id 
            state.paid = booking.paid
            state.price = booking.price
            state.start_time = booking.start_time
            state.duration = booking.duration
            state.status = booking.status
        },
        [SET_STATUS](state, status){
            state.status = status
        },
        resetState(state){
            Object.assign(state, getDefaultState())
        }

    },
    getters:{
        getRemainMoney: (state)=>{
            return state.price-state.booking_discount-state.paid;
          },
          getBooking: (state)=>{
              return {...state};
        },
    },
    actions: {
        setBookingTime({commit}, info){
            commit(SET_BOOKINGTIME, info)
        },
        setBookingField({commit}, f){
            commit(SET_BOOKINGFIELD, f)
        },
        setBookingDate({commit}, date){
            commit(SET_BOOKINGDATE, date)
        },
        setBookingPrice({commit}, price){
            commit(SET_BOOKINGPRICE, price);
        },
        setBookingId({commit}, id){
            commit(SET_BOOKINGID, id);
        },
        setBookingDiscount({commit}, discount){
            commit(SET_BOOKINGDISCOUNT, discount)
        },
        addBookingDiscount({commit}, discount){
            commit(ADD_BOOKINGDISCOUNT, discount)
        },
        setDuration({commit}, duration){
            commit(SET_DURATION, duration)
        },
        setBookingPaid({commit}, money){
            commit(SET_BOOKINGPAID, money)
        },
        setBooking({commit}, booking){
            commit(SET_BOOKING, booking)
        },
        setStatus({commit}, status){
            commit(SET_STATUS, status)
        },
        resetState({commit}){
            commit('resetState')
        }
    }
}
export default bookingModule;