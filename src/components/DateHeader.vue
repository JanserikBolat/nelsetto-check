<template>
    <div class="timetable__dateline">
        <div class="timetable__date">
            <p :class="isToday?'today':''">{{date.locale('ru').format('DD MMMM, dd')}}</p>
            <div v-if="buttonNeeded" class="changeDate__buttons">
                <div class="prev__day" @click="handleClick('prev')">
                    <i class="fas fa-angle-left"></i>
                </div>
                <div class="next__day" @click="handleClick('next')">
                    <i class="fas fa-angle-right"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    props: [ 'date', 'buttonNeeded'],
    methods: {
        handleClick(e){
            this.$emit(e);
        }
    },
    computed: {
        isToday: function(){
            return this.date.locale('ru').format('DD-MMMM-YYYY')===dayjs().locale('ru').format('DD-MMMM-YYYY')
        }
    }
}
</script>
<style lang="scss" scoped>
.timetable{
  &__dateline{
    width: 100%;
    height: 44px;
    background-color: #fff;
  }
  &__date{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    p{
      font-family: 'Roboto', sans-serif;
      font-weight: 700;
      font-size: 16px;
      padding-left: 8px;
      position: -webkit-sticky;
      position: sticky;
      left: 0;
    }
  }
}
.changeDate__buttons{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100px;
  padding-right: 8px;
  position: -webkit-sticky;
  position: sticky;
  right: 0;
  .prev__day, .next__day{
    width: 38px;
    height: 24px;
    border: 1px solid #9D9D9D;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg{
      width: 12px;
      height: 12px;
    }
  }
}
.today{
  color: red;
}
</style>