<template>
   <div class="edit__card">
        <div class="card__inner">
            <div class="edit__date">
                <p class="bold">Дата бронирования</p>
                <date-picker v-model="changedDate" format = "D MMMM, dddd" class="date-picker"></date-picker>
            </div>
            <div class="edit__timeAndField">
                <p class="bold">Время бронирования</p>
                <div class="time">
                    <div class="time__start">
                        <label style="margin-bottom:4px;">Время начала</label>
                        <drop-down :options="timelines" id="start" @selected="selected"/>
                    </div>
                    <div class="time__end">
                        <label style="margin-bottom:4px;">Время окончания</label>
                        <drop-down :options="timelines" id="end" @selected="selected"/>
                    </div>
                </div>
                <div class="field">
                    <drop-down :options="fields" id="field" @selected="selected"/>
                </div>
            </div>
            <div class="changes">
                <p class="bold">Изменения</p>
                <div class="changes__info">
                    <table style="width:100%">
                      <tr>
                        <td class="key">Дата:</td>
                        <td class="old">{{getDateFormat(this.date)}}</td> 
                        <td class="new" :class="!isDateEdited?'notEdited':''">{{getDateFormat(this.changedDate)}}</td>
                      </tr>
                      <tr>
                        <td class="key">Время:</td>
                        <td class="old">{{`${start_time}-${end_time}`}}</td>
                        <td class="new" :class="!isTimeEdited?'notEdited':''">{{`${changedStartTime}-${changedEndTime}`}}</td>
                      </tr>
                      <tr>
                        <td class="key">Площадка:</td>
                        <td class="old">№{{field_id}}</td>
                        <td class="new" :class="!isFieldEdited?'notEdited':''">№{{changedField}}</td>
                      </tr>
                      <tr>
                        <td class="key">Цена:</td>
                        <td class="old">{{price}} тг</td>
                        <td class="new" :class="!isEdited?'notEdited':''">{{changedPrice}} тг</td>
                      </tr>
                    </table>
                </div>
            </div>
        </div>   
    </div> 
</template>
<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/ru'
import DropDown from './DropDown.vue'
import {mapState} from 'vuex'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    data(){
        return{
            changedDate: '',
            changedStartTime:'',
            changedEndTime: '',
            changedField: '',
            changedPrice: '',
            timelines: ["05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30"],
            timeRangeIndex: [],
            timeRangePrice:[],
            fields: [],
            facility: JSON.parse(localStorage.getItem('facility'))
        }
    },
    mounted() {
        this.changedDate = this.date;
        this.changedStartTime = this.start_time;
        this.changedEndTime = this.end_time;
        this.changedField = this.field_id,
        this.changedPrice = this.price
        this.fields = Object.keys(this.facility.fields).map(e=>this.facility.fields[e].id);
    },
    components: {DatePicker, DropDown},
    computed: {
        ...mapState('booking', ['date', 'start_time', 'end_time', 'field_id', 'price']),
        isEdited(){
            return this.isDateEdited||this.isTimeEdited||this.isFieldEdited;
            
        },
        isDateEdited(){
            return this.getDateFormat(this.date)!==this.getDateFormat(this.changedDate);
        },
        isTimeEdited(){
            return this.start_time!==this.changedStartTime||this.end_time!==this.changedEndTime;
        },
        isFieldEdited(){
            return this.field_id!==this.changedField;
        },
    },
    methods: {
        getDateFormat(date){
            return dayjs(date).locale('ru').format('DD MMMM');
        },
        selected(option, id){
            if(id==='start'){
                this.changedStartTime = option
                }
            else if(id==='end'){
                this.changedEndTime = option
            }
            else if(id==='field'){
                this.changedField = option;
            }
            this.getPrice();
            this.$emit('hasChanged', this.isEdited);
        },
        getPrice(){
            if(this.isEdited){
                this.timeRangeIndex = []
                this.timeRangePrice = []
                const dayOfWeek = dayjs(this.changedDate).locale('ru').day();//день недели
                const newInf = this.facility.fields.filter(e=>e.id===this.changedField).map(e=>e.weekdays[dayOfWeek])[0].price;
                for(const price in newInf){
                    let idx = this.timelines.indexOf(price);
                    this.timeRangeIndex.push(idx);
                    this.timeRangePrice.push(newInf[price]);
                }
                return;
            }
            return this.price;
        }
    }
}
</script>
<style lang="scss" scoped>
:not(i){
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
}
.edit__card{
    padding: 16px;
    background: #fff;
}
.bold{
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 8px;
}
.date-picker{
    width: 100%;
    height: 40px;
}
.changes{
    &__new, &__old, &__keys{
        width: 33.3%;
        p{
            margin-bottom: 8px;
        }
    }
    &__info{
        display: flex;
    }
}
.time{
    display: flex;
    gap: 16px;
    margin-bottom: 8px;
    &__start, &__end{
        width: 50%;
    }
}
.new, .old, .key{
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 20px;
}
.old, .notEdited{
    color: #9D9D9D
}
td{
    margin-bottom: 8px;
}
</style>