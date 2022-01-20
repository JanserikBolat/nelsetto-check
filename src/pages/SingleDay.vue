<template>
    <div class="singleDay__main" ref="main">
      <spinner :start="start" />
        <MainHeader filterType = "oneDay" @changed="changed"/>
        <div class="content">
            <DateHeader :date="day" :buttonNeeded="true" @prev='prev' @next='next'/>
            <Timetable :id="day.format('DD-MM-YYYY')" :date="day" :infoAboutDay="setInfo(day.day())" @move="move" :bookings="bookings"/>
        </div>
        <div class="bookings">
            <div class="bookings__title">
                <p class="bookings_count">Брони: {{bookings.length}}</p>
                <div class="debts">
                  <p class="debtForToday" v-if="debtForToday>0">Получено: {{debtForToday}} ₸({{debtInCard}} ₸)</p>
                  <p class="remain" v-if="remain>0">Остаток: <span>{{remain}} ₸</span></p>
                </div>
            </div>
            <div v-for="booking, index in bookings" :key="index" class="bookings__content">
                <BookingMiniature :info="booking" @addPayload="addPayload" />
            </div>
        </div>
        <BottomMenu active="calendar"/>
    </div>
</template>
<script>
import dayjs from 'dayjs'
import 'dayjs/locale/ru';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import MainHeader from '../components/MainHeader.vue'
import Timetable from '../components/Timetable.vue'
import DateHeader from '../components/DateHeader.vue'
import BookingMiniature from '../components/BookingMiniature.vue'
import BottomMenu from '../components/BottomMenu.vue'
import {mapState} from 'vuex';
import axios from 'axios'
import Spinner from "../components/Spinner.vue";
export default {
    props: ['id'],
    data(){
        return {
            day: dayjs().locale('ru'),
            bookings: [],
            openPopup: false,
            oId: '',
            bId: '',
            remainForBooking: 0,
            start: false,
            options: [],
            url: window.location.origin.replace('playfields.', ''),
            initialValue: {},
            timelines: ["05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30"]            
        }
    }, 
    watch: {
        day: async function(){
            window.scrollTo(0,0)
            this.getDailyOrders();
        },
        'facility.id': function(){
            window.scrollTo(0,0)
            this.getDailyOrders();
        }
    },
    async mounted(){
        dayjs.extend(customParseFormat)
        window.scrollTo(0,0)

        this.day = dayjs(this.id, "DD-MM-YYYY").locale('ru')

        window.onbeforeunload = function () {
            window.scrollTo(93, 0);
        }


        this.$store.dispatch('order/resetState');
        this.$store.dispatch('booking/resetState');


        await this.getDailyOrders();
    }, 
    methods:{
        move(l){
            this.$refs['main'].scrollLeft=l*9/10;
        },
        handleBackdrop(backdrop){
          this.backdrop = backdrop;
        },
        setInfo(dayOfWeek){
            let infoFieldsDaily = {}
            this.getFacility.forEach(e=>{
                infoFieldsDaily = {...infoFieldsDaily, [e.id]:e.periods_data[dayOfWeek]}
            })
            return infoFieldsDaily
        },
        async getDailyOrders(){
            this.start = true;
            await axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${sessionStorage.getItem('active_facility')}/${this.day.format('DD-MM-YYYY')}`, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(res=>{
              this.bookings = res.data.bookings;
            })
          this.start = false;
        },
        prev(){
            this.day = this.day.subtract(1,'day');
            this.$router.push({name:'day', params: {id: this.day.format('DD-MM-YYYY')} })   
            
        },
        next(){
            this.day = this.day.add(1,'day');
            this.$router.push({name:'day', params: {id: this.day.format('DD-MM-YYYY')} })
        },
        addPayload(oId, bId, r){
            this.bId = bId
            this.oId = oId
            this.openPopup = true
            this.remainForBooking = r
        },
        closePayment(){
            this.openPopup = false
        },
        changed(id){
            this.start = true;
            this.$store.dispatch('facility/resetFacility', parseInt(id)).then(()=>this.start = false);
            sessionStorage.setItem('active_facility', parseInt(id))
        }
    },
    components: {
      Spinner,
      Timetable,
      MainHeader,
      DateHeader,
      BookingMiniature,
      BottomMenu,
    },
    computed:{
        getSingleDay: function(){
            return this.$route.params.id.toString();
        },
        getFacility(){
            return this.facility.playfields?.filter(e=>{
                if(e.periods_data!==null){
                   return !e.periods_data[this.day.day()].dayoff
                }})??[];
        },
        debtForToday(){
            return this.bookings.reduce((acc, curr)=>acc+curr.paid,0)
        },
        debtInCard(){
          return this.bookings.filter(e=>e.order.payment_type==='card').reduce((acc, curr)=>acc+curr.paid,0)
        },
        remain(){
          return this.bookings.reduce((acc, curr)=>acc+curr.debt,0)
        },
        ...mapState('admin', ['user']),
        ...mapState('facility', ['facility'])
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
    width: max-content;
    padding-top: 93px;
}
.bookings{
    position: sticky;
    left: 0;
    right: 0;
    width: 100%;
}
.bookings::-webkit-scrollbar{
    width: 0;
}
.bookings__title{
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    .debts{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    p.bookings_count{
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
    }
    .debtForToday, .remain{
      font-weight: normal;
      font-size: 12px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.87);
    }
  .remain{
    span{
      color: #FF5252;
    }
  }
}
</style>
