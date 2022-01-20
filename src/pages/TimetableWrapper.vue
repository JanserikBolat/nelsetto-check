<template>
<div class="timetable__wrapper" ref="main">
    <MainHeader filterType = "allTime" @changed="changed" />
    <div class="content" :key="index" v-for="day, index in bookings">
        <DateHeader :date="getDayObject(bookings[index].date)" :buttonNeeded="false"/>
        <Timetable :id="index" :date="getDayObject(bookings[index].date)" :infoAboutDay="setInfo(bookings[index].date)" @move="move" :bookings="bookings[index].bookings"/>
    </div>
    <BottomMenu active= "calendar" />
</div>
</template>
<script>
import Timetable from '../components/Timetable.vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import MainHeader from '../components/MainHeader.vue'
import DateHeader from '../components/DateHeader.vue'
import BottomMenu from '../components/BottomMenu.vue'
import {mapState} from 'vuex'
import axios from 'axios'
export default {
    components: {
        Timetable,
        MainHeader,
        DateHeader,
        BottomMenu,
    },
    data(){
        return{
            today: dayjs().locale('ru'),
            start: false,
            dates: [],
            bookings: [], 
            page: 1,
            lastPage: 1,
            sending: false,
            url: window.location.origin.replace('playfields.', '')
        }
    },
    watch: {
        'facility.id': async function(){
            this.reset();
            await this.getRangeBookings();
            this.scrollToToday();
        }
    },
    async created(){
        this.setDate();
        window.addEventListener('scroll', this.checkIfEnd);
    },
    destroyed: function () {
        window.removeEventListener('scroll', this.checkIfEnd);
    },
    async mounted(){
        dayjs.extend(customParseFormat);
        this.$store.dispatch('order/resetState');
        this.$store.dispatch('booking/resetState');
        await this.getRangeBookings();
    },
    computed:{
        ...mapState('admin', ['user']),
        ...mapState('facility', ['facility'])
    },
    methods:{
        checkIfEnd(){
          if(this.lastPage>=this.page) {
            if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight && !this.sending) {
              this.getRangeBookings();
            }
          }
        },
        reset(){
            this.bookings = [];
            this.page = 1;
            this.lastPage = 1;

        },
        setDate(){
            let day = dayjs().locale('ru').hour(0).minute(0).second(0)
            for(let i = 0;i<7;i++){
                this.dates.push(day)
                day = day.add(1, 'day')
            }
        },
        async getRangeBookings(){
            this.sending = true;
            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${this.facility.id}/date-range/?page=${this.page}`, {
                'start_date': this.today.format('YYYY-MM-DD'),
                'end_date':  this.today.add(1, 'year').format('YYYY-MM-DD')
            },{
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then((res)=> {
                this.bookings.push(...res.data.paginator.data);
                this.page++;
                this.lastPage = res.data.paginator.last_page;
                this.sending = false;
            })
        },
        setInfo(date){
            let d = dayjs(date, 'YYYY-MM-DD').day();
            let infoFieldsDaily = {}
            this.getFacility(d).forEach(e=>{
                infoFieldsDaily = {...infoFieldsDaily, [e.id]:e.periods_data[d]}
            })
            return infoFieldsDaily
        }, 
        getFacility(day){
            return this.facility.playfields?.filter(e=>{
                if(e.periods_data!==null){
                   return !e.periods_data[day].dayoff
                }})??[];
        },
        changed(id){
            this.start = true;
            this.$store.dispatch('facility/resetFacility', parseInt(id)).then(()=>this.start = false);
            sessionStorage.setItem('active_facility', parseInt(id))
        },
        scrollToToday(){
            window.scrollTo(0,0)
            window.onbeforeunload = function () {
                window.scrollTo(0, 0)
            }
        },
        getDayObject(day){
            return dayjs(day, 'YYYY-MM-DD').locale('ru');
        },
        move(l){
          this.$refs['main'].scrollLeft=l*9/10;
        }
    }

}
</script>
<style lang = "scss" scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.content{
    width: max-content;
    min-width: 2487px;
}

.timetable__wrapper{
    overflow-x: scroll;
    padding-bottom: 49px;
    &:first-child{
        margin-top: 93px;
    }
}

</style>