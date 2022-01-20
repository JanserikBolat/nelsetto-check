<template>
    <div class="workingHours">
        <div class="workingHours__inner">
            <p class="title">Выберите дни</p>
            <div class="week__days">
                <div @click="daySelected('1')" class="day monday" :class="{'daySelected': selectedDays.includes('1'), 'saved': saved.includes('1')}">Пн</div>
                <div @click="daySelected('2')" class="day tuesday" :class="{'daySelected': selectedDays.includes('2'), 'saved': saved.includes('2')}">Вт</div>
                <div @click="daySelected('3')" class="day wednesday" :class="{'daySelected': selectedDays.includes('3'), 'saved': saved.includes('3')}">Ср</div>
                <div @click="daySelected('4')" class="day thursday" :class="{'daySelected': selectedDays.includes('4'), 'saved': saved.includes('4')}">Чт</div>
                <div @click="daySelected('5')" class="day friday" :class="{'daySelected': selectedDays.includes('5'),'saved': saved.includes('5')}">Пт</div>
                <div @click="daySelected('6')" class="day saturday" :class="{'daySelected': selectedDays.includes('6'),'saved': saved.includes('6')}">Сб</div>
                <div @click="daySelected('0')" class="day sunday" :class="{'daySelected': selectedDays.includes('0'),'saved': saved.includes('0')}">Вс</div>
            </div>

            <p class="workingHours__text">Режим работы</p>
            <div class="startTime__endTime" v-show="!checked&&!clock_checked">
                <div class="start__time">
                    <drop-down :options="getStartOptions" @selected="selected" id="start" :initialValue="startValue"/>
                </div>
                <div class="end__time">
                    <drop-down :options="getEndOptions" @selected="selected" id="end" :initialValue="endValue"/>
                </div>
            </div>
            <div class="roundTheClock" v-show="selectedDays.length>0">
                <p>Круглосуточно</p>
                <label class="switch">
                    <input type="checkbox" @click="clock_checked=!clock_checked" v-model="clock_checked" :disabled="checked">
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="dayOff" v-show="selectedDays.length>0">
                <p>Выходной</p>
                <label class="switch">
                    <input type="checkbox" @click="checked=!checked" v-model="checked" :disabled="clock_checked">
                    <span class="slider round"></span>
                </label>
            </div>
            <div @click="addWorkingHours()" class="add__button" :class="{'available': isAvailable}">
                Добавить
            </div>
        </div>
    </div>
</template>
<script>
import DropDown from './DropDown.vue'
export default {
    props: ['saved'],
    data(){
        return{
            selectedDays: [],
            workingHours: [],
            checked: false,
            clock_checked: false,
            startValue: {value: '', text: ''},
            endValue: {value: '', text: ''},
            timelines: ["05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00"]
        }
    },
    components: {
        DropDown
    },
    computed: {
        isAvailable: function(){
            return (this.startValue.value&&this.endValue.value&&this.selectedDays.length>0)||this.checked||this.clock_checked;
        },
        getStartOptions(){
            return this.timelines.map(e=>{return {'value': e, 'text':e}});
        },
        getEndOptions(){
            return this.timelines.slice(this.timelines.indexOf(this.startValue.value)+1).map(e=>{return {'value': e, 'text':e}})
        }
    },
    methods:{
        daySelected(day){
            if(this.selectedDays.includes(day)){
                this.selectedDays = this.selectedDays.filter(e=>e!==day);
            }
            else{
                this.selectedDays.push(day);
            }
        },
        addWorkingHours(){
            if(this.clock_checked){
                this.workingHours = this.timelines;
            }
            this.$emit('daySelected', this.selectedDays, this.checked, this.workingHours);
            this.resetValues();
        },
        selected(option, id){
            if(id==='start'){
                this.startValue = {...option};
                //Если меняется время начала, то нужно поменять и время окончания на +30мин, чтобы избегать случаев, где startTime>=endTime
                this.endValue.text= this.timelines[this.timelines.indexOf(option.text)+1];
                this.endValue.value = this.timelines[this.timelines.indexOf(option.text)+1];
            }
            else if(id==='end'){
                this.endValue = {...option};
            }
            this.workingHours = this.timelines.slice(this.timelines.indexOf(this.startValue.value), this.timelines.lastIndexOf(this.endValue.value)+1);
        },
        resetValues(){
            this.selectedDays = [],
            this.workingHours=[]
            this.checked = false;
            this.startValue = {value: '', text: ''};
            this.endValue = {value: '', text: ''};
        }
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
.workingHours{
    padding: 16px;
    background: #fff;
    margin-bottom: 16px;
    &__text{
        margin-bottom: 8px;
    }
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
        background-color: #C4C4C4;
        margin-right: 8px;
    }
    .daySelected{
    background-color: #039BE5;
    color: #fff;
}
.saved{
    background: #000;
    color: #fff;
    pointer-events: none;
}
}
.startTime__endTime{
    display: flex;
    gap: 15px;
    margin-bottom: 16px;
    .start__time, .end__time{
        width: 100%;
    }
}
.dayOff, .roundTheClock{
    display: flex;
    gap: 4px;
    align-items: center;
    margin-bottom: 16px;
}
.add__button{
    padding: 5px 7px;
    background: #C4C4C4;
    display: inline-block;
    pointer-events: none;
}
.available{
    background: #000;
    color: #fff;
    pointer-events: initial;
}
.switch {
  position: relative;
  display: inline-block;
  width: 28px;
  height: 16px;
  input{
    opacity: 0;
    width: 0;
    height: 0;
  }
  input:disabled ~ .slider{
      background: #9c9a9a;
  }
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #78909C;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 2px;
  top:  calc(50% - 12px/2);
  background: #FFFFFF;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15);
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(12px);
  -ms-transform: translateX(12px);
  transform: translateX(12px);
}
.slider.round {
  border-radius: 12px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>