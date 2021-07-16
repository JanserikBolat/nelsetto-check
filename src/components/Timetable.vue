<template>
    <div class="timetable" :style="date<today?'pointer-events: none':''">
        <div v-if="getLen" class="backdrop"></div>
        <div class="container" :class="getLen?'active':''">
            <div class="timetable__dateline" :class="getLen?'active':''">
                <slot name="timeline"></slot>
            </div>
            <div class="timetable__content" :class="getLen?'active':''">
                <div v-if="today===date" class="redLine" :style="moveRedLine()"></div>
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
                            v-for="time, index in timelines.slice(0,-1)" :key="index"
                            @click="makeOrder(index, field.id)"
                            :class="selectedCells.indexOf(`${field.id}_${index}`)>=0?'selected':''"
                            :style="timelineStyles[field.id][index]"
                        >
                            {{getPrice}}
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
    props: ['id', 'date', 'infoAboutDay', 'facility'],
    data(){
        return{
            timelines: [],
            firstSelected: null,
            selectedCells: [],
            orderInfo: {date: this.date, duration: 30, durationRange: 1},
            today: dayjs().format('DD MMMM, dd'),
            timelineStyles: {}
        }
    },
    created(){
        this.generateTime();
        this.disableTime();
        if(this.today===this.date){
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

        },
        disableTime(){
            for(const f in this.facility){
                let styleField = []
                let infoForField = this.infoAboutDay[f]
                let startIdx = this.timelines.indexOf(infoForField.start_time)<0?0:this.timelines.indexOf(infoForField.start_time)//2
                let endIdx = this.timelines.indexOf(infoForField.end_time)<0?this.timelines.length:this.timelines.indexOf(infoForField.end_time)//0
                for(let j = 0;j<this.timelines.length-1;j++){
                    if(startIdx>=endIdx){
                        for(let s = endIdx;s<startIdx;s++){
                            styleField[s] = 'pointer-events: none; background: grey'
                        }
                    }
                    else{
                        for(let s = 0;s<startIdx;s++){
                            styleField[s] = 'pointer-events: none; background: grey'
                        }
                        for(let s = endIdx;s<this.timelines.length;s++){
                            styleField[s] = 'pointer-events: none; background: grey'
                        }
                    }
                }
                this.timelineStyles[this.facility[f].id]=styleField
            }
        },
    },
    computed:{
        getLen: function(){
            return this.selectedCells.length
        },
        getPrice: function(){
            return '+'
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
                cursor: pointer
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
