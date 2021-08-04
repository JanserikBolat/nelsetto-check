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
            bId: ''
        }
    },
    created(){
        this.getDailyOrders();
        this.getSingleDay
    },
    beforeUpdate(){
        this.getDailyOrders();
        console.log(this.day)
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
                    if(dayjs(this.orders[order]['bookings'][booking].date).format('DD-MM-YYYY')===this.day.format('DD-MM-YYYY')){
                        this.bookings.push({...this.orders[order], 'booking': this.orders[order]['bookings'][booking], "client": this.orders[order]['client']})
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
