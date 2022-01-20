<template>
    <div class="priceSettings">
        <div class="priceSettings__inner">
            <p class="title">Проставьте цены</p>
            <div class="week__days">
                <div class="day" v-for="day, index in selectedDays" :key="index">{{day}}</div>
            </div>
            <p class="tip">Добавьте цену за полчаса и промежуток действия</p>
            <div class="input__fields" v-show="startValue&&endValue&&localWH.length>1">
                <div class="price__input">
                    <input type="text" inputmode="tel" placeholder="Добавьте цену за полчаса" v-model="price">
                </div>
                <div class="interval__input">
                    <div class="start__time">
                        <drop-down :options="getStartOptions" id="start" @selected="selected" :fixed="true" :initialValue="startValue"/>
                    </div>
                    <div class="end__time">
                        <drop-down :options="getEndOptions" id="end" @selected="selected" :initialValue="endValue"/>
                    </div>
                </div>
            </div>
            <div class="info__wrapper">
                <div class="clear_all" v-if="info.length">
                    <span class="clear_all_button" @click.stop="clearAll()">
                        Очистить все
                        <img src="/img/clear-all.svg" />
                    </span>
                </div>
                <div class="info__show"
                v-for="inf, index in info"
                :key="index"
                >
                <div class="interval">{{inf.start_time.text}} - {{inf.end_time.text}}</div>
                <div class="price__and__cancel">
                    <div class="price">{{inf.price}} ₸</div>
                </div>
                </div>
            </div>
            <div @click="addToInfo()" class="add__button" :class="{'available': isAvailable||allDone}">
                Добавить
            </div>
        </div>
    </div>
</template>
<script>
import DropDown from './DropDown.vue'
export default {
    props: ["selectedDays", "workingHours"],
    data(){
        return{
            info: [],
            startValue: {},
            endValue: {},
            price: '',
            localWH: [],
            sendData: {},
            timelines: ["05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00"]
        }
    },
    watch: {
        workingHours: function(value){
            this.localWH = value;
            this.startValue =  {value: this.localWH[0], text: this.localWH[0]};
            this.endValue = {value: this.localWH[1], text: this.localWH[1]}
        }
    },
    components: {
        DropDown
    },
    methods: {
         selected(option, id){
            if(id==='end'){
                this.endValue = {...option}
                //this.start_time = this.workingHours[0];
            }
         },
         addToInfo(){

            for(let i = this.timelines.indexOf(this.startValue.value);i<this.timelines.lastIndexOf(this.endValue.value);i++){
                this.sendData[[this.timelines[i]]] = this.price;
            }

            this.info.push({'start_time': this.startValue, 'end_time': this.endValue, 'price': this.price});
            this.localWH = this.localWH.slice(this.localWH.lastIndexOf(this.endValue.value));
            if(this.allDone){
                this.$emit('readyToChange', this.info, this.workingHours[0], this.workingHours[this.workingHours.length-1], this.sendData);
                this.info = [];
                this.sendData = {};
            }
            this.clear();

         },
        clear(){
            this.startValue =  {value: this.localWH[0], text: this.localWH[0]};
            this.endValue = {value: this.localWH[1], text: this.localWH[1]}
            this.price = ''
        },
        clearAll(){
            this.localWH = this.workingHours;
            this.info = [];
            this.sendData = {};
            this.startValue =  {value: this.localWH[0], text: this.localWH[0]};
            this.endValue = {value: this.localWH[1], text: this.localWH[1]}
            this.price = ''
        }
    },
    computed: {
        isAvailable: function(){
            return this.startValue&&this.endValue&&this.price;
        },
        allDone(){
            return !(this.startValue&&this.endValue&&this.localWH.length>1);
        },
        getStartOptions(){
            return this.localWH.map(e=>{return {'value': e, 'text':e}});
        },
        getEndOptions(){
            return this.localWH.slice(this.localWH.indexOf(this.startValue.value)+1).map(e=>{return {'value': e, 'text':e}})
        },
    }
}
</script>
<style lang="scss" scoped>
:not(i){
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: #000;
}
.priceSettings{
    padding: 16px;
    background: #fff;
    margin-bottom: 16px;
}
.title{
    font-weight: 500;
    font-size: 20px;
    line-height: 32px;
}
.week__days{
    display: flex;
    margin: 16px 0px;
    .day{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #039BE5;
        color: #fff;
        margin-right: 8px;
    }
}
.input__fields{
    margin: 16px 0px;
    .price__input{
        input{
            width: 100%;
            height: 40px;
            padding: 8px;
        }
    }
    .interval__input{
        display: flex;
        margin: 16px 0px;
        gap: 5px;
        .start__time, .end__time{
            width: 100%;
        }
    }
}
.add__button{
    padding: 5px 7px;
    background: #C4C4C4;
    display: inline-block;
    pointer-events: none;
    margin-top: 16px;
}
.available{
    background: #000;
    color: #fff;
    pointer-events: initial;
}
.info__show{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.price__and__cancel{
    display: flex;
    gap: 12.17px;
}
.clear_all{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 16px 0px;
    &_button{
        display: flex;
        align-items: center;
        font-size: 12px;
        line-height: 14px;
        color: rgba(0, 0, 0, 0.87);
        img{
            margin-left: 4px;
        }
    }
}
</style>