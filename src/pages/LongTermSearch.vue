<template>
    <div class="longTermSearch">
            <order-header>
                <template v-slot:orderHeader>
                    <p class= "new__order">Результаты поиска</p>
                    <div class="close__order" @click="goBack()">
                        <i class="fa fa-times-circle" aria-hidden="true"></i>
                    </div>
                </template>
            </order-header>
        <div class="longTermSearch__inner">
            <div class="little__info">
                <p class="first__line">Площадка №{{booking.playfield_id}}, {{getDayOfWeek(order.start_date)}}</p>
                <p class="second__line">С {{getDateFormat(order.start_date)}} по {{getDateFormat(order.end_date)}}</p>
                <p class="third__ling">Доступно {{getAvailable}} из {{getAllBookingsCount}}</p>
            </div>
            <div class="results" v-if="booking_availibilty.length">
                <booking-availability v-for="date, index in bookings" @handleSelect="handleSelect" :date="date" :isFree="booking_availibilty[index]" :key="index"/>
            </div>
        </div>
        <div class="information">
            <p class="selected">Выбрано броней: {{getSelectedDaysCount}}</p>
            <p class="all__price">Общая сумма: {{getAllPrice}} тг</p>
            <div class="continue" @click.stop="createOrder()" :class="{'canNotContinue':!getSelectedDaysCount}">Продолжить</div>
        </div>
    </div>
</template>
<script>
import OrderHeader from '../components/OrderHeader.vue'
import BookingAvailability from '../components/BookingAvailability.vue'
import {mapState, mapGetters} from 'vuex';
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import axios from 'axios'
export default {
    data(){
        return{
            bookings: [],
            timelines: ["05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30"],
            orders: JSON.parse(localStorage.getItem('orderInfo')),
            selectedDates:[],
            booking_availibilty: [],
            url: window.location.origin.replace('playfields.', '')
        }
    },
    created(){
        this.getAllBookings();

    },
    async mounted(){
        window.scrollTo(0,0)
        this.booking_availibilty = await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/playfield/${this.booking.playfield_id}/check-range`,
            this.bookings.map(e=>{return {'start_time':this.booking.start_time, 'end_time':this.booking.end_time, 'date': e.format('YYYY-MM-DD')}}),
        {
            headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
        }).then(e=>e.data.response);


        this.selectedDates = this.bookings.map((e, index)=>{return {'date': e, 'isSelected': this.booking_availibilty[index]}});
    },
    components: {OrderHeader, BookingAvailability},
    computed: {
        ...mapState('order', ['order']),
        ...mapGetters('booking', ['getBooking']),
        ...mapState('booking', ['booking']),
        getAllBookingsCount(){
            let s = this.order.start_date;
            let e = this.order.end_date;
            return e.diff(s, 'week')+1;
        },
        getAvailable(){
            return this.booking_availibilty.filter(e=>e).length;
        },
        getAllPrice(){
            return this.getSelectedDaysCount*this.booking.price;
        },
        getSelectedDaysCount(){
            return this.selectedDates.filter(e=>e.isSelected).length;
        }
    },
    methods:{
        handleSelect(obj){
            let idx = this.selectedDates.findIndex(e=>e.date.format('YYYY-MM-DD')===obj.date.format('YYYY-MM-DD'));
            this.selectedDates[idx]['isSelected']=!this.selectedDates[idx]['isSelected'];
        },
        getSelectedBookingsCount(){
            return this.selectedDates.filter(e=>e.isSelected).length;
        },
        getDayOfWeek(day){
            return dayjs(day).locale('ru').format('dddd')
        },
        getDateFormat(day){
            return dayjs(day).locale('ru').format('DD MMMM')
        },
        getAllBookings(){
            let s = this.order.start_date;
            const weeks = this.getAllBookingsCount;
            for(let i =  0;i<weeks;i++){
                this.bookings.push(s);
                s = s.add(7, 'day');
            }
        },
        createOrder(){
            if(this.getSelectedDaysCount){
                const bookings = [];
                const filteredDays = this.selectedDates.filter(e=>e.isSelected);
                filteredDays.forEach(e=>{
                    this.$store.dispatch('booking/setBookingDate', e.date);
                    bookings.push(this.getBooking);
                });
                this.$store.dispatch('order/setDate', {'start_date': filteredDays[0].date, 'end_date':filteredDays[filteredDays.length-1].date} )
                this.$store.dispatch('order/replaceBooking', bookings)
                this.$router.push({path: '/order'})
            }
        },
        goBack(){
            this.$store.dispatch('order/resetState');
            this.$store.dispatch('booking/resetState');
            this.$router.push({path: '/'});
        },   
    }
}
</script>
<style lang="scss" scoped>
:not(i){
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
}
.longTermSearch{
     min-height: 100vh;
     overflow: auto;
}
.longTermSearch__inner{
    padding: 12px 16px;
    margin-bottom: 131px;
    .little__info{
        margin-bottom: 16px;
    }
}
.information{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 131px;
    padding: 24px 16px;
    z-index: 2;
    background: #fff;
    box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04);
    .continue{
        background: #000;
        color: #fff;
        border: 1px solid #9D9D9D;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        margin-top: 16px;
    }
    .canNotContinue{
        background: #9D9D9D;
        pointer-events: none;
    }
}
</style>