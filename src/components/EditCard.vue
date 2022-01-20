<template>
   <div class="edit__card">
     <div class="backdrop" v-if="hasError"></div>
     <error-card :message="message" v-if="hasError" @close="hasError = false"/>
     <spinner :start="sending"/>
        <div class="card__inner" >
            <div class="edit__date">
                <p class="bold">Дата бронирования</p>
                 <date-picker v-model="changedDate" format = "DD MMMM, YYYY" style="width: 100%;height:40px" @change="checkBooking" :placehodler="changedDate"></date-picker>
            </div>
            <div class="edit__timeAndField">
                <p class="bold">Время бронирования</p>
                <div class="time">
                    <div class="time__start">
                        <label style="margin-bottom:4px;">Время начала</label>
                        <drop-down :options="getStartOptions" id="start" @selected="selected" :initialValue="{value: changedStartTime, text: changedStartTime}"/>
                    </div>
                    <div class="time__end">
                        <label style="margin-bottom:4px;">Время окончания</label>
                        <drop-down :options="getEndOptions" id="end" @selected="selected" :initialValue="{value: changedEndTime, text: changedEndTime}"/>
                    </div>
                </div>
                <div class="field">
                    <drop-down :options="fields" id="field" @selected="selected" :initialValue="{value: changedField, text: getPfName}"/>
                </div>
            </div>
            <div class="changes">
                <p class="bold">Изменения</p>
                <div class="changes__info">
                    <table style="width:100%">
                      <tr>
                        <td class="key">Дата:</td>
                        <td class="old">{{getDateFormat(this.booking.date)}}</td> 
                        <td class="new" :class="{'notEdited': !isDateEdited}">{{getDateFormat(this.changedDate)}}</td>
                      </tr>
                      <tr>
                        <td class="key">Время:</td>
                        <td class="old">{{`${booking.start_time.substring(0,5)}-${booking.end_time.substring(0,5)}`}}</td>
                        <td class="new" :class="{'notEdited':!isTimeEdited}">{{`${changedStartTime}-${changedEndTime}`}}</td>
                      </tr>
                      <tr>
                        <td class="key">Площадка:</td>
                        <td class="old">{{booking.playfield.pf_name}}</td>
                        <td class="new" :class="{'notEdited':!isFieldEdited}">{{changedField.text}}</td>
                      </tr>
                      <tr>
                        <td class="key">Цена:</td>
                        <td class="old">{{booking.price}} тг</td>
                        <td class="new" :class="{'notEdited': !isEdited}">{{changedPrice}} тг</td>
                      </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="save">
            <div class="save__button" @click.stop="saveChanges()" :class="{'available': isEdited&&isValidToSave}">Сохранить</div>
        </div>   
    </div> 
</template>
<script>
import DropDown from './DropDown.vue'
import {mapState} from 'vuex'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import axios from 'axios'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/ru'
import Spinner from "./Spinner";
import ErrorCard from "./ErrorCard";
export default {
    data(){
        return{
            changedDate: '',
            changedStartTime:'',
            changedEndTime: '',
            changedField: '',
            changedPrice: '',
            timelines: ["05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00"],
            fields: [],
            message: '',
            hasError: false,
            isValidToSave: false,
            sending: false,
            url: window.location.origin.replace('playfields.', '')
        }
    },
    components: {
      ErrorCard,
      Spinner,
        DatePicker, DropDown
    },
    mounted() {
        this.changedDate = this.booking.date;
        this.changedStartTime = this.booking.start_time.substring(0,5);
        this.changedEndTime = this.booking.end_time.substring(0,5);
        this.changedField = {value: this.booking.playfield.id, text: this.booking.playfield.name},
        this.changedPrice = this.booking.price
        this.fields = Object.keys(this.facility.playfields).map(e=>{return {value: this.facility.playfields[e].id, text: this.facility.playfields[e].pf_name}});
    },
    computed: {
        ...mapState('booking', ['booking']),
        ...mapState('facility', ['facility']),
        ...mapState('order', ['order']),
        isEdited(){
            return this.isDateEdited||this.isTimeEdited||this.isFieldEdited;

        },
        isDateEdited(){
            return this.getDateFormat(this.booking.date)!==this.getDateFormat(this.changedDate);
        },
        isTimeEdited(){
            return this.booking.start_time.substring(0,5)!==this.changedStartTime||this.booking.end_time.substring(0,5)!==this.changedEndTime;
        },
        isFieldEdited(){
            return this.booking.playfield.id!==this.changedField.value;
        },
        getStartOptions(){
            const start_idx = 0
            const end_idx = this.getTimelines.indexOf(this.changedEndTime)
            return this.getTimelines.slice(start_idx, end_idx+1).map(e=>{return {text: e, value: e}})
        },
        getWorkingHours(){
          const dayOfWeek = dayjs(this.changedDate).day();
          return {'start': this.getPf.periods_data[dayOfWeek].start_time, 'end': this.getPf.periods_data[dayOfWeek].end_time}
        },
        getEndOptions(){
            const start_idx = this.getTimelines.indexOf(this.changedStartTime);
            const end_idx = this.getTimelines.length
            return this.getTimelines.slice(start_idx+1, end_idx+1).map(e=>{return {text: e, value: e}})
        },
        getDuration(){
            const totalMinutes = (this.getTimelines.indexOf(this.changedEndTime)-this.getTimelines.indexOf(this.changedStartTime)+1)*30;
            const hours = Math.floor(totalMinutes/60)
           const minutes = totalMinutes%60
           return `${hours} ч ${minutes} мин`
        },
        getTimelines(){
          const s = this.timelines.indexOf(this.getWorkingHours.start);
          const e = this.timelines.lastIndexOf(this.getWorkingHours.end);
          return this.timelines.slice(s, e+1);
        },
        getPfName(){
          return this.getPf.pf_name;
        },
        getPf(){
          return this.facility.playfields.find(e=>e.id===this.changedField.value);
        }
    },
    methods: {
        getDateFormat(date){
            return dayjs(date).locale('ru').format('DD MMMM, YYYY');
        },
        selected: async function(option, id){
            if(id==='start'){
                if(this.getTimelines.indexOf(option.value)<this.getTimelines.indexOf('00:00')&&this.getTimelines.indexOf(this.changedStartTime)>=this.timelines.indexOf('00:00')){
                    let v = dayjs(this.changedDate.value).subtract(1,'day');
                    this.changedDate = {value: v, text: this.getDateFormat(v)}
                }
                if(this.getTimelines.indexOf(option.value)>=this.getTimelines.indexOf('00:00')&&this.getTimelines.indexOf(this.changedStartTime)<this.timelines.indexOf('00:00')){
                    let v = dayjs(this.changedDate.value).add(1,'day');
                    this.changedDate = {value: v, text: this.getDateFormat(v)}
                }
                this.changedStartTime = option.value;
                this.changedEndTime = this.getTimelines[this.timelines.indexOf(this.changedStartTime)+1];
            }
            else if(id==='end'){
                this.changedEndTime = option.value;
            }
            else if(id==='field'){
                this.changedField = option;
            }
            await this.checkBooking();
        },
        async checkBooking(){
          this.sending = true;
            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/playfield/${this.booking.playfield.id}/check-reservation`, {
                    start_time: this.changedStartTime,
                    end_time: this.changedEndTime,
                    date: dayjs(this.changedDate).format('YYYY-MM-DD'),
                    booking_id: this.booking.id,
                    playfield_id: this.changedField.value
            }, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(res=>{
                this.changedPrice = res.data.new_price
                this.isValidToSave = true
                }).catch((err)=>{
                  this.isValidToSave = false
                  this.hasError = true;
                  this.message = err.response.data.error;
                }).finally(()=>this.sending = false);
            },
        async saveChanges(){
            if(this.isValidToSave){
                await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/playfield/${this.booking.playfield.id}/change-reservation`, {
                        start_time: this.changedStartTime,
                        end_time: this.changedEndTime,
                        date: dayjs(this.changedDate).format('YYYY-MM-DD'),
                        booking_id: this.booking.id,
                        playfield_id: this.changedField.value
                }, {
                    headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
                }).then(()=>{
                    this.$router.push({name: 'orders'})
                    }).catch(err=>{
                      this.hasError = true;
                      this.message = err.response.data.error;
                });
          }
        },
        getDayOfWeek(d){
            return dayjs(d).day();
        },
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
    background: #fff;
    .backdrop {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 10;
  }
  .card__inner{
    padding: 16px;
  }
}
.bold{
    font-weight: 500;
    font-size: 16px;
    margin: 8px 0px;
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
    margin-bottom: 8px;
    &__start{
        margin-right: 16px;
    }
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
.save{
    padding: 0px 16px;
    position: absolute;
    width: 100%;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    &__button{
        height: 36px;
        border-radius: 4px;
        color: #FFFFFF;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        letter-spacing: 1.25px;
        text-transform: uppercase;
        background: #9D9D9D;
        pointer-events: none;
    }
    .available{
        background: #03A9F4;
        pointer-events: all;
    }
}
</style>