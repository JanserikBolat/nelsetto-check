<template>
  <div>
    <div v-for="day, index in dates" :key="index" class="content">
        <DateHeader :date="day" :buttonNeeded="false"/>
        <Timetable :id="index" :date="day" :infoAboutDay="setInfo(day.day())"/>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  props: ['dates'],
  methods: {
    setInfo(dayOfWeek){
        let infoFieldsDaily = {}
        this.getFacility(dayOfWeek).forEach(e=>{
            infoFieldsDaily = {...infoFieldsDaily, [e.id]:e.periods_data[dayOfWeek]}
        })
        return infoFieldsDaily
    },
     getFacility(day){
        return this.facility.playfields?.filter(e=>!e.periods_data[parseInt(day)].dayoff)??[]
    },
  },
  data() {
    return {
      page: 1,
      last_page: 5,
    };
  },
  computed: {
      ...mapState('facility', ['facility'])
  }
};