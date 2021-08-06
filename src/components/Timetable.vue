<template>
    <div class="timetable" :id="id">
        <div v-if="getLen||show" class="backdrop" @click="closePopup"></div>
        <div class="container" :class="getLen?'active':''">
            <div class="timetable__content" :class="getLen?'active':''">
                <div v-if="isToday" class="redLine" :style="moveRedLine()"></div>
                <div class="timetable__fields">
                    <div class="timetable__field empty"></div>
                    <div class="timetable__field"
                        v-for="field in facility.fields" :key="field.id"
                    >
                        {{field.id}}
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
                        v-for="field in facility.fields" :key="field.id"
                    >
                        <Cell
                            v-for="time, index in timelines.slice(0,-1)" :key="index"
                            @makeOrder="makeOrder(index, field.id)"
                            @showInfoAboutOrder="showOrderInfo(index, field.id)"
                            :class="{'selected':selectedCells.indexOf(`${field.id}_${index}`)>=0}"
                            :style="timelineStyles[field.id][index]"
                            :value="cellValues[field.id][index]"
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
export default {
    components: {OrderPopup, Cell, OrderInfoPopup},
    props: ['id', 'date', 'infoAboutDay', 'buttonNeeded'],
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
            facility: JSON.parse(localStorage.getItem('facility')),
            show: false,
            orders: JSON.parse(localStorage.getItem('orderInfo')),
            infoToShow: {}
        }
    },
    created(){
        this.generateTime();
        this.disableTime();
        this.getPrice();
        this.getOrders();
        if(this.isToday){
            this.moveRedLine();
        }
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
                        this.setOrderInfo(i,fieldId, end)
                        for(;i<=end;i++){
                            this.selectedCells.push(`${fieldId}_${i}`)
                        }
                        this.firstSelected = null
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
                sum+=this.cellValues[f][i]
            }
            this.durationRange = endIdx-startIdx+1;
            this.$store.dispatch('booking/setBookingTime', {start_time: this.timelines[startIdx], end_time: this.timelines[endIdx+1]});
            this.$store.dispatch('booking/setBookingField', f)
            this.$store.dispatch('booking/setBookingDate', this.getDayIfMidnight)
            this.$store.dispatch('booking/setBookingPrice', sum);
            this.$store.dispatch('booking/setDuration', this.getDuration)
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
            const MARGIN_LEFT = 62
            let now = `${dayjs().format('HH')}:${dayjs().minute()<30?'00':'30'}` 
            let redlineIdx;
            for(let i=0;i<this.timelines.length;i++){
                if(now===this.timelines[i]){
                    redlineIdx = i
                    break
                }
            }
            const left = MARGIN_LEFT+Math.floor(CELL_WIDTH/2)+(CELL_WIDTH+MARGIN_BETWEEN_CELLS)*redlineIdx
            this.leftScroll = left
            return `left:${left}px`

        },
        moveTableToCenter(){
            document.getElementById(this.id).scrollIntoView({behavior:'smooth', block: 'center'});
        },
        disableTime(){
            for(const f in this.facility.fields){
                let styleField = []
                let infoForField = this.infoAboutDay[f]
                let startIdx = this.timelines.indexOf(infoForField.start_time)<0?0:this.timelines.indexOf(infoForField.start_time)
                let endIdx = this.timelines.indexOf(infoForField.end_time)<0?this.timelines.length:this.timelines.indexOf(infoForField.end_time)
                for(let j = 0;j<this.timelines.length-1;j++){
                    if(startIdx>=endIdx){
                        for(let s = endIdx;s<startIdx;s++){
                            styleField[s] = 'pointer-events: none; background: black'
                        }
                    }
                    else{
                        for(let s = 0;s<startIdx;s++){
                            styleField[s] = 'pointer-events: none; background: black'
                        }
                        for(let s = endIdx;s<this.timelines.length;s++){
                            styleField[s] = 'pointer-events: none; background: black'
                        }
                    }
                }
                this.timelineStyles[this.facility.fields[f].id]=styleField
            }
        },
        getPrice: function(){
                for(const f in this.infoAboutDay){
                    const priceKeys = Object.keys(this.infoAboutDay[f].price).map(e=>this.timelines.indexOf(e))
                    const prices = Object.keys(this.infoAboutDay[f].price).map(e=>this.infoAboutDay[f].price[e])
                    const cell_prices = []
                    for(let i = 0;i<priceKeys.length-1;i++){
                        for(let j = priceKeys[i];j<priceKeys[i+1];j++){
                            cell_prices[j] = prices[i]
                        }
                    }
                    if(priceKeys[priceKeys.length-1]>this.timelines.indexOf(this.infoAboutDay[f].end_time)){
                        for(let i = 0;i<this.timelines.indexOf(this.infoAboutDay[f].end_time);i++){
                            cell_prices[i] = prices[prices.length-1]
                        }
                        for(let i = priceKeys[priceKeys.length-1];i<this.timelines.length-1;i++){
                            cell_prices[i] = prices[prices.length-1]
                        }
                    }
                    else{
                        for(let i = priceKeys[priceKeys.length-1];i<this.timelines.indexOf(this.infoAboutDay[f].end_time);i++){
                            cell_prices[i] = prices[prices.length-1]
                        }
                    }
                    this.cellValues[this.facility.fields[f].id] = cell_prices
                }

            
        },
        getOrders: function(){
            for(const order in this.orders){
                for(const booking in this.orders[order]['bookings']){
                    
                    if(dayjs(this.orders[order]['bookings'][booking]['date']).format('DD-MM-YYYY')===this.date.format('DD-MM-YYYY')){
                        let e_idx = this.timelines.indexOf(this.orders[order]['bookings'][booking]['end_time'])
                        let s_idx = this.timelines.indexOf(this.orders[order]['bookings'][booking]['start_time'])
                        
                        let f_idx = this.orders[order]['bookings'][booking]['field_id']
                        for(let i = s_idx;i<e_idx;i++){
                            this.cellValues[f_idx][i] = this.orders[order].client.client_name
                        }
                    }
                }
            }
        },
        showOrderInfo: function(idx, f_idx){
            this.selectedCells = []
            for(const order in this.orders){
                for(const booking in this.orders[order]['bookings']){
                    let bkng = this.orders[order]['bookings'][booking]
                    if(dayjs(bkng.date).format('DD-MM-YYYY')===this.date.format('DD-MM-YYYY')){
                        if(bkng.field_id===f_idx){
                            let s_idx = this.timelines.indexOf(bkng.start_time)
                            let e_idx = this.timelines.indexOf(bkng.end_time)
                            if(idx>=s_idx&&idx<e_idx){
                                this.infoToShow = {...this.orders[order], "bookingInfo":bkng}
                            }
                        }
                    }
                }
            }
            this.show = true
        },
    },
    computed:{
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
            return this.date.format('DD MMMM, dd')===this.today.format('DD MMMM, dd')
        },
        getDayIfMidnight: function(){
            let b = this.$store.state.booking;
            const MIDNIGHT = '00:00';
            if(this.timelines.indexOf(b.start_time)>=this.timelines.indexOf(MIDNIGHT)){
                return this.date.add(1, 'day');
            }
            else{
                return this.date;
            }
        },
        getDuration: function(){
           const totalMinutes = this.duration*this.durationRange
           const hours = Math.floor(totalMinutes/60)
           const minutes = totalMinutes%60
           return `${hours} ч ${minutes} мин`
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
    height: 151px;
    background-color: #DEDEDE;
    position: relative;
    &__content{
        position: relative;
        display: flex;
        height: 151px;
        .redLine{
            position: absolute;
            width: 1px;
            height: 100%;
            background: red;
            }
    }
        &__fields{
            width: 37px;
            height: 100%;
            left: 0;
            background: #DEDEDE;
            position: sticky;
            }
            &__field{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 37px;
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
  z-index: 10;
  }
.active{
    z-index: 11;
    background: inherit;
}
.timetable__dateline.active{
    background: #fff;
} 
.today{
    color: red;
    }
.blocked{
    background: #000!important;
    }
}
</style>
