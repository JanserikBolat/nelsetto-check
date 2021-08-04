<template>
    <div class="timetable__dateline">
        <div class="timetable__date">
            <p :class="isToday?'today':''">{{date.format('DD MMMM, dd')}}</p>
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
            return this.date.format('DD MMMM, dd')===dayjs().locale('ru').format('DD MMMM, dd')
        }
    }
}
</script>
<style lang="scss" scoped>
    .timetable{
        &__dateline{
            position: sticky;
            left: 0;
            top: 0;
            width: 100vw;
            height: 44px;
            background-color: #fff;
        }
        &__date{
            display: flex;
            justify-content: space-between;
            align-items: center;
            p{
                font-family: 'Roboto', sans-serif;
                font-weight: 700;
                font-size: 16px;
                padding-left: 8px;
                padding-top: 20px;
                }
        }
    }
    .changeDate__buttons{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100px;
            margin-right: 25px;
            .prev__day, .next__day{
                width: 25px;
                height: 20px;
                border: 1px solid #9D9D9D;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }
        }
    .today{
        color: red;
    }
</style>