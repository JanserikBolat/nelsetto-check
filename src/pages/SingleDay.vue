<template>
    <div class="singleDay__main">
        <MainHeader filterType = "oneDay" />
        <div class="content">
            <DateHeader :date="day" :buttonNeeded="true" @prev='prev' @next='next' :key="id"/>
            <Timetable :id="id" :date="day" :infoAboutDay="setInfo(day.day())" :facility="facility" :key="day.toString()"/>
        </div>
        <div class="bookings">
            <div class="bookings__title">
                <p>Брони: {{bookings.length}}</p>
            </div>
            <div v-for="booking, index in bookings" :key="index" class="bookings__content">
                <BookingMiniature :info="booking" @addPayload="addPayload" />
            </div>
        </div>
        <BottomMenu active="calendar"/>
        <payment-popup v-if="openPopup" @addPayment="addMoney" @closePayment="closePayment"/> 
    </div>
</template>
<script>
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import MainHeader from '../components/MainHeader.vue'
import Timetable from '../components/Timetable.vue'
import DateHeader from '../components/DateHeader.vue'
import BookingMiniature from '../components/BookingMiniature.vue'
import PaymentPopup from '../components/PaymentPopup.vue'
import BottomMenu from '../components/BottomMenu.vue'
export default {
    data(){
        return {
            facility: JSON.parse(localStorage.getItem('facility')),
            day: dayjs().locale('ru'),
            id: 7,
            bookings: [],
            orders: JSON.parse(localStorage.getItem('orderInfo')),
            openPopup: false,
            oId: '',
            bId: '',
            timelines: ["05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30"]            
        }
    },
    created(){
        this.getDailyOrders();
        this.getSingleDay
    },
    beforeUpdate(){
        this.getDailyOrders();
    },
    methods:{
        setInfo(dayOfWeek){
            let infoFieldsDaily = {}
            for(const field in this.facility.fields){
                infoFieldsDaily = {...infoFieldsDaily, [field]:this.facility.fields[field].weekdays[dayOfWeek]}
            }
            return infoFieldsDaily
        },
        getDailyOrders(){
            this.bookings = [];
            for(const order in this.orders){
                for(const booking in this.orders[order]['bookings']){
                    let localDay = this.day;
                    if(this.timelines.indexOf(this.orders[order]['bookings'][booking]['start_time'])>=this.timelines.indexOf('00:00')){
                        localDay = localDay.add(1, 'day')
                    }
                    if(dayjs(this.orders[order]['bookings'][booking].date).format('DD-MM-YYYY')===localDay.format('DD-MM-YYYY')){
                        if(this.orders[order].status!=='Отменено'){
                            this.bookings.push({...this.orders[order], 'booking': this.orders[order]['bookings'][booking], "client": this.orders[order]['client']})
                        }
                    }
                }
            }
        },
        prev(){
            this.day = this.day.subtract(1,'day');
            this.$router.push({name:'day', params: {id: this.day.format('DD-MM-YYYY')} })   
            
        },
        next(){
            this.day = this.day.add(1,'day');
            this.$router.push({name:'day', params: {id: this.day.format('DD-MM-YYYY')} })
        },
        addPayload(oId, bId){
            this.bId = bId
            this.oId = oId
            this.openPopup = true
        },
        closePayment(){
            this.openPopup = false
        },
        addMoney(money){
            for(const order in this.orders){
                if(this.oId===this.orders[order].orderId){
                    for(const booking in this.orders[order]['bookings']){
                        if(this.orders[order]['bookings'][booking].bookingId===this.bId){
                            this.orders[order]['bookings'][booking].paid+=money
                            break;
                        }
                    }
                }
            }
            localStorage.setItem('orderInfo', JSON.stringify(this.orders))
            this.openPopup = false
        }
    },
    components: {
      Timetable, 
      MainHeader, 
      DateHeader,
      BookingMiniature,
      PaymentPopup,
      BottomMenu
    },
    computed:{
        getSingleDay: function(){
            return this.$route.params.id.toString();
        },
        
    }
    
}
</script>
<style lang="scss" scoped>
.singleDay__main{
    overflow: auto;
    min-height: 100vh;
    background: #E5E5E5;
    margin-bottom: 49px;
}
.content{
    padding-top: 93px;
}
.bookings{
    position: sticky;
    left: 0;
    right: 0;
    width: 100vw;
}
.bookings::-webkit-scrollbar{
    width: 0;
}
.bookings__title{
    background: #fff;
    height: 52px;
}
</style>
