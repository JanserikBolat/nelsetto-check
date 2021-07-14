<template>
<div class="timetable__wrapper">
    <Timetable :id="index"  v-for="day, index in dates" :key="index" :date="day"/>
</div>
</template>
<script>
import Timetable from './Timetable.vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    components: {
        Timetable
    },
    data(){
        return{
            dates: []
        }
    },
    mounted(){
         dayjs.locale('ru')
         var day = dayjs()
         for(let i = 0;i<30;i++){
             this.dates.push(day.format('DD MMMM, dd'))
             day = day.add(1, 'day')
         }

    }
}
</script>
<style scoped lang = "sass">
.timetable__wrapper
    overflow: auto
</style>