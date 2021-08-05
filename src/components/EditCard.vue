<template>
   <div class="edit__card">
        <div class="card__inner">
            <div class="edit__date">
                <p class="bold">Дата бронирования</p>
                <drop-down :options="getDateOptions" id="date" @selected="selected" :initialValue="changedDate"/>
            </div>
            <div class="edit__timeAndField">
                <p class="bold">Время бронирования</p>
                <div class="time">
                    <div class="time__start">
                        <label style="margin-bottom:4px;">Время начала</label>
                        <drop-down :options="getStartOptions" id="start" @selected="selected" :initialValue="changedStartTime"/>
                    </div>
                    <div class="time__end">
                        <label style="margin-bottom:4px;">Время окончания</label>
                        <drop-down :options="getEndOptions" id="end" @selected="selected" :initialValue="changedEndTime"/>
                    </div>
                </div>
                <div class="field">
                    <drop-down :options="fields" id="field" @selected="selected" :initialValue="changedField"/>
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
                        <td class="new" :class="{'notEdited':!isTimeEdited, 'notValid': !isChangeValid}">{{`${changedStartTime}-${changedEndTime}`}}</td>
                      </tr>
                      <tr>
                        <td class="key">Площадка:</td>
                        <td class="old">№{{field_id}}</td>
                        <td class="new" :class="{'notEdited':!isFieldEdited, 'notValid': !isChangeValid}">№{{changedField}}</td>
                      </tr>
                      <tr>
                        <td class="key">Цена:</td>
                        <td class="old">{{price}} тг</td>
                        <td class="new" :class="{'notEdited': !isEdited, 'notValid': !isChangeValid}">{{changedPrice}} тг</td>
                      </tr>
                    </table>
                </div>
            </div>
        </div>   
    </div> 
</template>
<script>
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
            fields: [],
            facility: JSON.parse(localStorage.getItem('facility')),
            timelinesPrices: [],
            orders: JSON.parse(localStorage.getItem('orderInfo'))
        }
    },
    mounted() {
        this.timelinesPrices =  new Array(this.timelines.length),
        this.changedDate = this.date;
        this.changedStartTime = this.start_time;
        this.changedEndTime = this.end_time;
        this.changedField = this.field_id,
        this.changedPrice = this.price
        this.fields = Object.keys(this.facility.fields).map(e=>this.facility.fields[e].id);
    },
    components: {DropDown},
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
        isChangeValid(){
            return this.orders.map(el=>el.bookings.filter(e=>{
                return  this.isDateValid(e.date)&&this.isFieldValid(e.field_id)&&this.isRangeValid(e.start_time, e.end_time)
                }
            )).filter(e=>e.length!==0).length===0
        },
        getStartTime(){
            return  this.facility.fields.filter(e=>e.id===this.changedField)[0].weekdays[this.getDayOfWeek(this.changedDate)].start_time;
        },
        getEndTime(){
            return  this.facility.fields.filter(e=>e.id===this.changedField)[0].weekdays[this.getDayOfWeek(this.changedDate)].end_time;
        },
        getStartOptions(){
            const start_idx = this.timelines.indexOf(this.getStartTime)
            const end_idx = this.timelines.indexOf(this.getEndTime) 
            return this.timelines.slice(start_idx, end_idx)
        },
        getEndOptions(){
            const start_idx = this.timelines.indexOf(this.changedStartTime);
            const end_idx = this.timelines.indexOf(this.getEndTime)
            return this.timelines.slice(start_idx+1, end_idx+1)
        },
        getDateOptions(){
            const dates = [];
            let day = dayjs().locale('ru')
            for(let i = 0;i<7;i++){
                dates.push(day);
                day = day.add(1, 'day');
            }
            return dates;
        },
        getDuration(){
            const totalMinutes = (this.timelines.indexOf(this.changedEndTime)-this.timelines.indexOf(this.changedStartTime)+1)*30;
            const hours = Math.floor(totalMinutes/60)
           const minutes = totalMinutes%60
           return `${hours} ч ${minutes} мин`
        }
    },
    methods: {
        isRangeValid(st, et){
            const changed_st_idx = this.timelines.indexOf(this.changedStartTime);
            const changed_et_idx = this.timelines.indexOf(this.changedEndTime);
            const st_idx = this.timelines.indexOf(st);
            const et_idx = this.timelines.indexOf(et)
            return changed_st_idx<et_idx&&changed_et_idx>st_idx
        },
        isDateValid(d){
            return this.getDateFormat(d)===this.getDateFormat(this.changedDate)
        },
        getDateFormat(date){
            return dayjs(date).locale('ru').format('DD MMMM');
        },
        isFieldValid(f){
            return f===this.changedField
        },
        selected(option, id){
            if(id==='start'){
                this.changedStartTime = option
                if(this.timelines.indexOf(this.changedStartTime)>this.timelines.indexOf(this.changedEndTime)){
                    this.changedEndTime = this.timelines[this.timelines.indexOf(this.changedStartTime)+1]
                }
                }
            else if(id==='end'){
                this.changedEndTime = option
            }
            else if(id==='field'){
                this.changedField = option;
            }
            else if(id==='date'){
                this.changedDate = option;
            }
            this.getPrice();
            this.$emit('hasChanged', this.isEdited&&this.isChangeValid, {date: this.changedDate, time: {start_time: this.changedStartTime, end_time: this.changedEndTime}, field_id: this.changedField, price: this.changedPrice, duration: this.getDuration});
        },
        dateChanged(){
            this.getPrice();
        },
        getDayOfWeek(d){
            return dayjs(d).day();
        },
        getPrice(){
            const prices = this.facility.fields.filter(e=>e.id===this.changedField)[0].weekdays[this.getDayOfWeek(this.changedDate)].price;
            Object.keys(prices).forEach(e=>this.timelinesPrices[this.timelines.indexOf(e)] = prices[e])
            let lastPrice = 0
            for(let i = 0;i<this.timelinesPrices.length;i++){
                if(this.timelinesPrices[i]===undefined){
                    this.timelinesPrices[i]= lastPrice
                }
                else{
                    lastPrice = this.timelinesPrices[i]
                }
            }
            const changed_st_idx = this.timelines.indexOf(this.changedStartTime);
            const changed_et_idx = this.timelines.indexOf(this.changedEndTime);
            this.changedPrice = this.timelinesPrices.slice(changed_st_idx, changed_et_idx).reduce((acc, curr)=>acc+curr, 0)           
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
.notValid{
    color: rgba($color: #d83636, $alpha: 1.0)
}
.old, .notEdited{
    color: #9D9D9D
}
td{
    margin-bottom: 8px;
}
</style>