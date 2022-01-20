<template>
    <div class="timetable" v-if="!start">
        <div class="container" >
            <div class="timetable__content">
                <div class="timetable__fields">
                    <div class="timetable__field empty"></div>
                    <div class="timetable__field"
                        v-for="(field, index) in facilityPlayfields" :key="field.id"
                        :style="`width:${isPhone?'37px':'100px'}`"
                    >
                        {{isPhone?`№ ${index+1}`:field.pf_name}}
                    </div>
                </div>
                <div class="timetable__time__cells">
                    <div class="timetable__timeline">   
                        <div class="timetable__time"
                            v-for="time, index in timelines" :key="index"
                        >
                            <p>{{time}}</p>
                        </div>
                    </div>
                    <div class="timetable__cells"
                        v-for="field in facilityPlayfields" :key="field.id"
                    >
                        <SimpleCell
                            v-for="(time, index) in timelines.slice(0,-1)" :key="index"
                            :class="{'notAvailable':!isAvailable}"
                            :style="timelineStyles[field.id][index]"
                            :value="cellValues[field.id][index]"
                        >
                        </SimpleCell>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>
<script>
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { mapState } from 'vuex'
import axios from 'axios';
import SimpleCell from "./SimpleCell";
export default {
    components: {SimpleCell},
    props: ['id', 'date', 'reservation', 'client'],
    data(){
        return{
            timelines: [],
            today: dayjs(),
            timelineStyles: {},
            cellValues: {},
            leftScroll: 0,
            orders: [],
            start: false,
            bookings: [],
            url: window.location.origin.replace('playfields.', '')
        }
    },
    async mounted(){
        this.generateTime();
        this.disableTime();
        await this.getDailyOrders();
        this.getPrice();
        this.getOrders();
        this.moveRedLine();
        this.$emit('move', this.leftScroll);
    },
    methods: {
        generateTime(){
            for(let i = 5;i<29;i++){
                let real_i = i%24;
                const time = real_i < 10 ? `0${real_i}` : `${real_i}`;
                this.timelines.push(`${time}:00`);
                this.timelines.push(`${time}:30`);
            }
            this.timelines.push(this.timelines[0]);
        },
        moveRedLine(){
            const CELL_WIDTH = 49;
            const MARGIN_BETWEEN_CELLS = 1 
            const MARGIN_LEFT = this.isPhone?67:130;

            const idx = this.timelines.indexOf(this.reservation.start_time.substring(0,5));
            const left = MARGIN_LEFT+Math.floor(CELL_WIDTH/2)+(CELL_WIDTH+MARGIN_BETWEEN_CELLS)*idx;
            this.leftScroll = left;

        },
        disableTime(){
            this.timelineStyles = [];
            this.facilityPlayfields.forEach(e=>{
                let styleField = []
                let startIdx = this.timelines.indexOf(this.infoAboutDay[e.id].start_time.substring(0,5));
                let endIdx = this.timelines.indexOf(this.infoAboutDay[e.id].end_time.substring(0,5));
                for(let j = 0;j<this.timelines.length-1;j++){
                    if(startIdx>=endIdx){
                        for(let s = endIdx;s<startIdx;s++){
                            styleField[s] = 'pointer-events: none; background: #2F5061'
                        }
                    }
                    else{
                        for(let s = 0;s<startIdx;s++){
                            styleField[s] = 'pointer-events: none; background: #2F5061'
                        }
                        for(let s = endIdx;s<this.timelines.length;s++){
                            styleField[s] = 'pointer-events: none; background: #2F5061'
                        }
                    }
                this.timelineStyles[e.id]= styleField;
            }
            })
        },
        getPrice: function(){
                for(const f in this.infoAboutDay){
                    const priceKeys = Object.keys(this.infoAboutDay[f].prices);
                    let cell_prices = new Array(this.timelines.length).fill({value: '', isReserved: false})
                    priceKeys.forEach(key=>
                        cell_prices[this.timelines.indexOf(key)] = {value: this.infoAboutDay[f].prices[key], isReserved: false}
                    )
                    this.cellValues[f] = cell_prices
                }
        }, 
        async getDailyOrders(){
          this.start = true;
            await axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${sessionStorage.getItem('active_facility')}/${this.date.format('DD-MM-YYYY')}`, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(res=> this.bookings = res.data.bookings).finally(()=> this.start = false);
        }, 
        getOrders(){
                this.bookings.forEach(e=>{
                let e_idx = this.timelines.indexOf(e.end_time.substring(0,5));
                let s_idx = this.timelines.indexOf(e.start_time.substring(0,5));
                const f_idx = e.playfield.id;

                for(let i = s_idx;i<e_idx;i++){
                    if(this.cellValues[f_idx]){
                        this.cellValues[f_idx][i] = {value: e.client.firstname, isReserved: true, booking_id: e.id}
                    }
                }
            });

            const res_e = this.timelines.indexOf(this.reservation.end_time.substring(0,5));
            const res_s = this.timelines.indexOf(this.reservation.start_time.substring(0,5));
            const res_f = this.reservation.playfield.id;
            for(let i = res_s;i<res_e;i++){
                if(this.cellValues[res_f][i].isReserved){
                    this.cellValues[res_f][i] = {...this.cellValues[res_f][i], isReserved: true, booking_id: this.id, is_pending: 'intersect'}
                }
                else{
                    this.cellValues[res_f][i] = {...this.cellValues[res_f][i], isReserved: true, booking_id: this.id, is_pending: 'no-intersect'}
                }
            }
            this.cellValues = {...this.cellValues}
        },
    },
    computed:{
         ...mapState('facility', ['facility']),
        ...mapState('order', ['order']),
        ...mapState('booking', ['booking']),
        isAvailable: function(){
            return this.date.diff(this.today, 'day', false)>=0
        },
        isEmpty: function(){
            return Object.keys(this.cellValues).length===0
        },
        isToday: function(){
            return this.date.format('DD-MM-YYYY')===this.today.format('DD-MM-YYYY')
        },
        facilityPlayfields(){
            if(this.order.type){
                return this.facility.playfields?.filter(e=>{
                    if(e.periods_data!==null){
                       return !e.periods_data[this.date.day()].dayoff
                    }})??[];
            }
            else{
                return this.facility.playfields.filter(e=>e.id===this.booking.playfield.id);
            }
        },
        isPhone: function(){
             let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
             return width<768;
        },
        infoAboutDay(){
            const dayOfWeek = this.date.day();
            let infoFieldsDaily = {}
            this.facilityPlayfields.forEach(e=>{
                infoFieldsDaily = {...infoFieldsDaily, [e.id]:e.periods_data[dayOfWeek]}
            })
            return infoFieldsDaily
        },
    }
}
</script>
<style  lang = "scss">
*{
    margin: 0;
    padding: 0;
}
.timetable{
    width: max-content;
    background-color: #DEDEDE;
    position: relative;
    &__content{
        position: relative;
        display: flex;
        .redLine{
            position: absolute;
            width: 1px;
            height: 100%;
            background: red;
            }
    }
        &__fields{
            height: 100%;
            left: 0;
            background: #DEDEDE;
            position: sticky;
            font-family: 'Roboto', sans-serif;
            font-size: 14px;
            line-height: 20px;
            padding-left: 5px;
            }
            &__field{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 30px;
                margin-bottom: 10px;
                }
            .empty{
                margin-bottom: 0;
                }
        &__timeline, &__cells{
            display: flex;
        }
            &__time{
                width: 49px;
                height: 30px;
                margin-left: 1px;
                p{
                    width: 35px;
                    height: 20px;
                    text-align: center;
                    margin: 6px 5px 8px;
                    padding: 0;
                    font-family: 'Roboto', sans-serif;
                    font-size: 14px;
                    line-height: 20px;
                    }
            }
        &__cells{
            height: 30px;
            margin-bottom: 10px;
            margin-left: 25px;
        }
.selected{
    outline: 1px solid red;
    }
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 15;
  }
.active{
    z-index: 15;
    background: inherit;
}
.timetable__dateline.active{
    background: #fff;
} 
.today{
    color: red;
    }
.notAvailable{
    background: rgb(241, 206, 200);
    color: white;
    }
}
</style>
