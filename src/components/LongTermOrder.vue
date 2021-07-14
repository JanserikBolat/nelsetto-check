<template>
    <div class="longTerm__order">
        <div class="container">
            <div class="order__info">
                <p>{{date}}</p>
                <p>{{time}}</p>
                <p>Площадка #2(6х6, крытое, иск.трава)</p>
            </div>
            <div class="order__period">
                <p style="font-weight: bold">Период бронирования</p>
                <div class="period__range">
                    <div class="start__period">
                        <p>Дата начала</p>
                        <date-picker v-model="startDate" format = "D MMMM, dd" style="width: 168px;height:40px" :placeholder="startDate" disabled></date-picker>
                    </div>
                    <div class="end__period">
                        <p>Дата окончания</p>
                        <date-picker v-model="endDate" format = "D MMMM, dd" style="width: 168px;height:40px" disabled-days="disabledDays">true'></date-picker>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/ru'
export default {
    props: ['date', 'time'],
    data(){
        return{
            startDate: this.date,
            endDate: ''
        }
    },
    components: {
        DatePicker
    }, 
    methods: {
        disabledDays(date){
            console.log(date.getDay());
        }
    }
}
</script>
<style lang="sass" scoped>
$font-stack: 14px 'Roboto', sans-serif
.longTerm__order
    margin-left: 12px
    margin-right: 12px
    .period__range
        display: flex
        justify-content: space-between
        align-items: center
p
    font: $font-stack
</style>
