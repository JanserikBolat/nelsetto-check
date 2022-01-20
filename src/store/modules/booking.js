import {SET_BOOKINGDISCOUNT, UPDATE_BOOKING,SET_FIELDNAME, ADD_BOOKINGDISCOUNT,SET_BOOKING, SET_BOOKINGDATE, SET_BOOKINGTIME, SET_DURATION, SET_BOOKINGFIELD, SET_BOOKINGPAID, SET_BOOKINGPRICE, SET_STATUS} from "../mutation-types";
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import axios from 'axios'
const getDefaultState = ()=>{
    return{
        booking: {
            id: null,
            order_id: null,
            discount: 0,
            date: '',
            end_time: '',
            playfield_id: '',
            paid: 0,
            price: 0,
            start_time: '',
            duration: 0,
            status: 'pending',
            debt: null,
            
        }
    }
}
//const url = window.location.origin.replace('playfields.', '');
const bookingModule = {
    namespaced: true,
    state: {...getDefaultState()},
    mutations: {
        [ADD_BOOKINGDISCOUNT](state, discount){
            state.booking.discount += discount 
        },
        [SET_BOOKINGDISCOUNT](state, discount){
            state.booking.discount = discount 
        },
        [SET_BOOKINGDATE](state, date){
            state.booking.date = date
        },
        [SET_BOOKINGTIME](state, time){
            state.booking.start_time = time.start_time
            state.booking.end_time = time.end_time
        },
        [SET_BOOKINGFIELD](state, field_id){
            state.booking.playfield_id = field_id
        },
        [SET_FIELDNAME](state, name){
            state.booking.pf_name = name;
        },
        [SET_BOOKINGPAID](state, paid){
            state.booking.paid+= paid
        },
        [SET_BOOKINGPRICE](state, price){
            state.booking.price = price
        },
        [SET_DURATION](state, duration){
            state.booking.duration = duration;
        },
        [SET_BOOKING](state, booking){
            state.booking = {...booking}
        },
        [UPDATE_BOOKING](state, booking){
            state.booking = {...state.booking, ...booking}
        },
        [SET_STATUS](state, status){
            state.booking.status = status
        },
        resetState(state){
            Object.assign(state, getDefaultState())
        }

    },
    getters:{
        getRemainMoney: (state)=>{
            return state.booking.price-state.booking.discount-state.booking.paid;
          },
          getBooking: (state)=>{
              return {...state.booking};
        },
        getDuration: (state)=>{
            const hours = Math.floor(state.booking.duration/3600)
            const minutes = (state.booking.duration%3600)/60;
            return `${hours} ч ${minutes} мин`
        },
        durationFormat: (state)=>{
            const hours = Math.floor(state.booking.duration/60)
            const minutes = state.booking.duration%60
            return dayjs().hour(hours).minute(minutes).second(0).format('HH:mm:ss')
        },
        getStatus: (state)=>{
            switch(state.status){
                case 'completed': 
                    return 'Завершена';
                case 'canceled': 
                    return 'Отменена';
                case 'pending': 
                    return 'В ожидании';
                case 'activated': 
                    return 'Потверждена';
            }
        },
        getPlayfieldName: (state)=>{
            return JSON.parse(localStorage.getItem('facility')).find(e=>e.id===state.booking.playfield_id)?.pf_name??'';
        }
    },
    actions: {
        setBookingTime({commit}, info){
            commit(SET_BOOKINGTIME, info)
        },
        setBookingField({commit}, f){
            commit(SET_BOOKINGFIELD, f)
        },
        setPlayfieldName({commit}, f){
            commit(SET_FIELDNAME, f)
        },
        setBookingDate({commit}, date){
            commit(SET_BOOKINGDATE, date)
        },
        setBookingPrice({commit}, price){
            commit(SET_BOOKINGPRICE, price);
        },
        setBookingDiscountLocal({commit}, d){
            commit(SET_BOOKINGDISCOUNT, d);
        },
        async setBookingDiscount({commit}, info){
            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/reservation/${info.id}/discount`, {discount: info.discount}, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}}
            ).then(res=> commit(UPDATE_BOOKING, res.data.booking))
        },
        addBookingDiscount({commit}, discount){
            commit(ADD_BOOKINGDISCOUNT, discount)
        },
        setDuration({commit}, duration){
            commit(SET_DURATION, duration)
        },
        async setBookingPaid({commit}, info){
            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/reservation/${info.id}/payment`, {payment: info.money}, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}}
            ).then(res=>commit(UPDATE_BOOKING, res.data.booking))
        },
        setBooking({commit}, booking){
            commit(SET_BOOKING, booking)
        },
        updateBooking({commit}, booking){
            commit(UPDATE_BOOKING, booking)
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