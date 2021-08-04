<template>
<div class="timetable__wrapper" ref="main">
    <MainHeader filterType = "allTime" />
    <div v-for="day, index in dates" :key="index" class="content">
        <DateHeader :date="day" :buttonNeeded="false"/>
        <Timetable :id="index" :date="day" :infoAboutDay="infoAboutDay[index]" />
    </div>
    <BottomMenu active= "calendar" />
</div>
</template>
<script>
import Timetable from '../components/Timetable.vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import MainHeader from '../components/MainHeader.vue'
import DateHeader from '../components/DateHeader.vue'
import BottomMenu from '../components/BottomMenu.vue'
export default {
    components: {
        Timetable,
        MainHeader,
        DateHeader,
        BottomMenu
    },
    data(){
        return{
            dates: [], 
            today: dayjs().locale('ru'),
            infoAboutDay: [],
            facility: JSON.parse(localStorage.getItem('facility')),
        }
    },
    created(){
        this.setDate()
    },
    mounted(){
        this.scrollToToday();
    },
    methods:{
        setDate(){
            dayjs.locale('ru')
            var day = dayjs()
            day = day.subtract(7, 'day')
            for(let i = 0;i<30;i++){
                this.infoAboutDay.push(this.setInfo(day.day()))
                this.dates.push(day)
                day = day.add(1, 'day')
            }
        },
        setInfo(dayOfWeek){
            return this.facility.fields.map(e=>e.weekdays[dayOfWeek])
        }, 
        scrollToToday(){
            const TIMETABLE__HEIGHT = 195
            const TIMETABLE__BEFORE = 7
            window.scrollTo(0, TIMETABLE__HEIGHT*TIMETABLE__BEFORE)
            window.onbeforeunload = function () {
                window.scrollTo(0, TIMETABLE__HEIGHT*TIMETABLE__BEFORE)
            }
        }
    }

}
</script>
<style lang = "scss">
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.content{
    width: max-content;
}

.timetable__wrapper{
    overflow-x: scroll;
    padding-bottom: 49px;
    &:first-child{
        margin-top: 93px;
    }
}

</style>