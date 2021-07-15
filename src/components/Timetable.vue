<template>
    <div class="timetable">
        <div v-if="selectedCells.length" class="backdrop"></div>
        <div class="container" :class="selectedCells.length?'active':''">
            <div class="timetable__dateline" :class="selectedCells.length?'active':''">
                <div class="timetable__date" :class="today?'today':''"><p>{{date}}</p></div>
            </div>
            <div class="timetable__content" :class="selectedCells.length?'active':''">
                <div v-if="today" class="redLine" :style="moveRedLine()"></div>
                <div class="timetable__fields">
                    <div class="timetable__field empty"></div>
                    <div class="timetable__field"
                        v-for="field in facility" :key="field.id"
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
                        v-for="field in facility" :key="field.id"
                    >
                        <div class="timetable__cell"
                            v-for="time, index in timelines" :key="index"
                            @click="makeOrder(index, field.id)"
                            :class="selectedCells.indexOf(`${field.id}_${index}`)>=0?'selected':''"
                        >
                            +
                        </div>
                    </div>
                </div>
            </div>
        </div>
         <OrderPopup v-if="selectedCells.length" :orderInfo="this.orderInfo" @closePopup ='closePopup()' />  
    </div>  
</template>
<script>
import OrderPopup from './OrderPopup.vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    components: {OrderPopup},
    props: ['id', 'date'],
    data(){
        return{
            facility: {
                field1: {
                    id: 1,
                    name: "#1 Spartak Arena",
                    startWork: 10,
                    endWork: 23,
                    price: 5000,
                },
                field2: {
                    id: 2,
                    name: "#2 Lokomotiv Arena",
                    startWork: 8,
                    endWork: 22,
                    price: 5000
                },
                field3: {
                    id: 3,
                    name: "#3 Dinamo Arena",
                    startWork: 9,
                    endWork: 24,
                    price: 5000,
                },
            },
            timelines: [],
            firstSelected: null,
            selectedCells: [],
            orderInfo: {date: this.date, duration: 30, durationRange: 1},
            today: this.date===dayjs().format('DD MMMM, dd')
        }
    },
    mounted(){
        this.generateTime();
        if(this.today){
            this.moveRedLine();
        }
    },
    methods: {
        generateTime(){
            let startTime = 25; //Нужно найти самое рано начинающее время среди полей
            let endTime = -1; //Нужно найти самое поздно заканчивающее время среди полей
            for(const key in this.facility){
                startTime = Math.min(this.facility[key]['startWork'], startTime)
                endTime = Math.max(this.facility[key]['endWork'], endTime)
            }
                

            //Генерируем время
            for(let i = startTime; i<endTime;i++){
                let real_i = i%24;
                let time = real_i < 10 ? `0${real_i}` : `${real_i}`;
                this.timelines.push(`${time}:00`);
                this.timelines.push(`${time}:30`);
            }



        },
        makeOrder(index, fieldId){ // Нужны и индекс ячейки, и индекс поля
            if(!this.firstSelected){ //Если еще ничего не выбрано
                this.selectedCells = []
                this.selectedCells.push(`${fieldId}_${index}`) //Добавляем id в массив
                this.firstSelected = {fieldId, cellId: index} // Присваиваем выбранную ячейку
                this.setOrderInfo(index)
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
                        this.setOrderInfo(i, end)
                        for(;i<=end;i++){
                            this.selectedCells.push(`${fieldId}_${i}`)
                        }
                        this.firstSelected = null
                    }
                }
                else{
                    //Если админ выбирает время на другом поле, то очищаем предыдущие значения, а выбранное присваиваем
                    this.setOrderInfo(index)
                    this.firstSelected = {fieldId, cellId: index}
                    this.selectedCells = []
                    this.selectedCells.push(`${fieldId}_${index}`)
                }
            }
        },
        setOrderInfo(startIdx, endIdx = startIdx){
             this.orderInfo = {...this.orderInfo, startTime: this.timelines[startIdx], endTime: this.timelines[endIdx+1], durationRange: endIdx-startIdx+1}
        },
        closePopup(){
            this.selectedCells = []
            this.orderInfo = {date: this.date, duration: 30, durationRange: 1}
            this.firstSelected = null
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
            return `left:${MARGIN_LEFT+Math.floor(CELL_WIDTH/2)+(CELL_WIDTH+MARGIN_BETWEEN_CELLS)*redlineIdx}px`

        }
    }
}
</script>
<style  lang = "sass" scoped>
.timetable
    width: max-content
    height: 195px
    background-color: #DEDEDE
    position: relative
    .timetable__dateline
        position: sticky
        left: 0
        top: 0
        width: 100vw
        height: 44px
        background-color: #fff
        overflow: hidden
        .timetable__date
            p
                margin-left: 8px
                margin-top: 20px
                font-family: 'Roboto', sans-serif
                font-weight: 700
                font-size: 16px

    .timetable__content
        position: relative
        display: flex
        height: 151px
        .redLine
            position: absolute
            width: 1px
            height: 100%
            background: red
        .timetable__fields
            width: 37px
            height: 100%
            left: 0
            background: #DEDEDE
            position: sticky
            .timetable__field
                display: flex
                justify-content: center
                align-items: center
                width: 37px
                height: 30px
                margin-bottom: 10px
            .empty
                margin-bottom: 0
        .timetable__timeline, .timetable__cells
            display: flex
            .timetable__time
                width: 49px
                height: 30px
                margin-left: 1px
                p
                    width: 35px
                    height: 20px
                    text-align: center
                    margin: 6px 5px 8px
                    padding: 0
                    font-family: 'Roboto', sans-serif
                    font-size: 14px
                    line-height: 20px
        .timetable__cells
            height: 30px
            margin-bottom: 10px
            margin-left: 25px
            .timetable__cell
                width: 49px
                height: 100%
                margin-left: 1px
                background-color: #fff
                font-family: 'Roboto', sans-serif
                font-size: 12px
                line-height: 20px
                color: rgba(0,0,0,0.5)
                display: flex
                justify-content: center
                align-items: center
.selected
    outline: 1px solid red
.backdrop 
  position: fixed
  top: 0
  left: 0
  bottom: 0
  right: 0
  background-color: rgba(0, 0, 0, 0.3)
  z-index: 10
.active
    z-index: 11
    background: inherit
.today
    color: red
</style>
