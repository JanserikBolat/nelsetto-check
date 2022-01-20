<template>
    <div class="timetable" :id="id">
        <div v-if="getLen||show" class="backdrop" @click="closePopup"></div>
        <div class="container" :class="getLen?'active':''">
            <div class="timetable__content" :class="getLen?'active':''">
                <div v-if="isToday" class="redLine" :style="moveRedLine()"></div>
                <div class="timetable__fields">
                    <div class="timetable__field empty"></div>
                    <div class="timetable__field"
                        v-for="field, index in facilityPlayfields" :key="field.id"
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
                        <Cell
                            v-for="(time, index) in timelines.slice(0,-1)" :key="index"
                            @makeOrder="isAvaiable&&makeOrder(index, field.id)"
                            @showInfoAboutOrder="showOrderInfo"
                            :class="{'selected':selectedCells.indexOf(`${field.id}_${index}`)>=0, 'notAvaiable':!isAvaiable}"
                            :style="timelineStyles[field.id][index]"
                            :value="cellValues[field.id][index]"
                            :nextBooking="cellValues[field.id][index+1]"
                        >
                        </Cell>
                    </div>
                </div>
            </div>
        </div>
         <OrderPopup v-if="selectedCells.length&&!show"  @closePopup ='closePopup()' />
         <OrderInfoPopup v-if="show" :info="infoToShow"/> 
    </div>  
</template>
<script>
import OrderPopup from './OrderPopup.vue'
import Cell from './Cell.vue'
import OrderInfoPopup  from './OrderInfoPopup.vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { mapState } from 'vuex'
export default {
    components: {OrderPopup, Cell, OrderInfoPopup},
    props: ['id', 'date', 'infoAboutDay', 'buttonNeeded', 'bookings'],
    data(){
        return{
            timelines: [],
            firstSelected: null,
            selectedCells: [],
            duration: 30, 
            durationRange: 1,
            today: dayjs(),
            timelineStyles: {},
            cellValues: {},
            leftScroll: 0,
            show: false,
            orders: [],
            infoToShow: {},
            start: false
        }
    },
    watch: {
        bookings: function(){
            this.disableTime();
            this.getPrice();
            this.getOrders();
            this.moveRedLine();
            this.$emit('move', this.leftScroll);
        },
        'facility.id': function(){
            this.disableTime();
            this.getPrice();
            this.getOrders();
            this.moveRedLine();
            this.$emit('move', this.leftScroll);
        }
    },
    async mounted(){
        this.generateTime();
        this.disableTime();
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
        makeOrder(index, fieldId){ // Нужны и индекс ячейки, и индекс поля
            this.moveTableToCenter();
            if(!this.firstSelected){ //Если еще ничего не выбрано
                this.selectedCells = []
                this.selectedCells.push(`${fieldId}_${index}`) //Добавляем id в массив
                this.firstSelected = {fieldId, cellId: index} // Присваиваем выбранную ячейку
                this.setOrderInfo(index, fieldId)
            }
            else{//Если уже первый элемент выбран
                if(fieldId===this.firstSelected.fieldId){ // Можно выбирать время только на одном поле
                    if(this.firstSelected.cellId===index){ //Если админ дважды нажимает на одну ячейку - должны все очистить
                        this.selectedCells = [] 
                        this.firstSelected = null
                    }
                    else{
                        //Если это не та ячейка, то выбраем все что между

                        //Использую мин и макс для того чтобы админ мог выбирать в двух направлениях
                        let i = Math.min(this.firstSelected.cellId, index)
                        let end = Math.max(this.firstSelected.cellId, index)
                        if(!this.cellValues[fieldId].slice(i, end+1).some(e=>e.isReserved)){
                            this.setOrderInfo(i,fieldId, end)
                            for(;i<=end;i++){
                                this.selectedCells.push(`${fieldId}_${i}`)
                            }
                            this.firstSelected = null
                        }
                        else{
                            this.setOrderInfo(index, fieldId)
                            this.firstSelected = {fieldId, cellId: index}
                            this.selectedCells = []
                            this.selectedCells.push(`${fieldId}_${index}`)
                        }
                    }
                }
                else{
                    //Если админ выбирает время на другом поле, то очищаем предыдущие значения, а выбранное присваиваем
                    this.setOrderInfo(index, fieldId)
                    this.firstSelected = {fieldId, cellId: index}
                    this.selectedCells = []
                    this.selectedCells.push(`${fieldId}_${index}`)
                }
            }
        },
        setOrderInfo(startIdx, f, endIdx = startIdx){
            let sum = 0
            for(let i = startIdx;i<endIdx+1;i++){
                sum+=parseInt(this.cellValues[f][i].value);
            }
            this.durationRange = endIdx-startIdx+1;
            let pf_name  = this.facilityPlayfields.find(e=>e.id===f).pf_name;
            this.$store.dispatch('booking/setBookingTime', {start_time: this.timelines[startIdx], end_time: this.timelines[endIdx+1]});
            this.$store.dispatch('booking/setBookingField', f);
            this.$store.dispatch('booking/setPlayfieldName', pf_name)
            this.$store.dispatch('booking/setBookingDate', this.dateFormat(this.getDayIfMidnight(startIdx), this.timelines[endIdx+1]));
            this.$store.dispatch('booking/setBookingPrice', sum);
            this.$store.dispatch('booking/setDuration', this.duration*this.durationRange*60);
        },
        closePopup(){
            this.selectedCells = []
            this.orderInfo = {description: '', date: this.date, duration: 30, durationRange: 1}
            this.firstSelected = null
            this.show = false
            this.$store.dispatch('booking/resetState');
        },
        moveRedLine(){
            const CELL_WIDTH = 49;
            const MARGIN_BETWEEN_CELLS = 1 
            const MARGIN_LEFT = this.isPhone?67:130;
        
            let now = `${dayjs().format('HH')}:${dayjs().minute()<30?'00':'30'}` 
            let redlineIdx = this.timelines.findIndex(e=>e===now);
            const left = MARGIN_LEFT+Math.floor(CELL_WIDTH/2)+(CELL_WIDTH+MARGIN_BETWEEN_CELLS)*redlineIdx
            this.leftScroll = left
            return `left:${left}px`

        },
        moveTableToCenter(){
            document.getElementById(this.id).scrollIntoView({behavior:'smooth', block: 'center'});
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
        getOrders(){
                this.bookings.forEach(e=>{
                let e_idx = this.timelines.indexOf(e.end_time.substring(0,5));
                let s_idx = this.timelines.indexOf(e.start_time.substring(0,5));
                const f_idx = e.playfield.id;
                this.orders.push(e.order_id);
                for(let i = s_idx;i<e_idx;i++){
                    this.cellValues[f_idx][i] = {value: e.client.firstname, isReserved: true, booking_id: e.id, amount: e_idx-s_idx, color: this.orders.indexOf(e.order_id)%2}
                }
                this.cellValues = {...this.cellValues}
            });
        },
        async showOrderInfo(b_id){
            this.selectedCells = []
            this.infoToShow = this.bookings.find(e=>e.id===b_id)
            this.show = true
        },
        dateFormat(date, h){
            return dayjs(date).hour(h.split(':')[0]).minute(h.split(':')[1]).second(0).millisecond(0)
        },
        getDayIfMidnight: function(s_idx){
            const MIDNIGHT = '00:00';
            return s_idx>=this.timelines.indexOf(MIDNIGHT)?this.date.add(1, 'day'):this.date;
        },
    },
    computed:{
         ...mapState('facility', ['facility']),
        getLen: function(){
            return this.selectedCells.length
        },
        isAvaiable: function(){
            return this.date.diff(this.today, 'day', false)>=0
        },
        isEmpty: function(){
            return Object.keys(this.cellValues).length===0
        },
        isToday: function(){
            return this.date.format('DD-MM-YYYY')===this.today.format('DD-MM-YYYY')
        },
        facilityPlayfields(){
            return this.facility.playfields?.filter(e=>{
                if(e.periods_data!==null){
                   return !e.periods_data[this.date.day()].dayoff
                }})??[];
        },
        isPhone: function(){
             let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
             return width<768;
        }
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
.notAvaiable{
    background: rgb(241, 206, 200);
    color: white;
    pointer-events: none;
    }
}
</style>
