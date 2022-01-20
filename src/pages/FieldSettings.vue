<template>
<div class="field__setting">
    <MenuHeader :backButton="true" @back="back">
        <template v-slot:title>
            <p class="field__time">Время на площадке</p>
        </template>
    </MenuHeader>
    <div class="field__text">{{isDaySelected?'Проставьте цены':'Укажите режим работы'}}</div>
    <working-hours @daySelected='daySelected' :saved="saved" v-show="show"/>
    <PriceSettings v-show="!show&&!isDayOff" :selectedDays="selectedDaysF" :workingHours="workingHours" @readyToChange="readyToChange"/>
    <div class="wrapper">
        <ChangedCard style="margin-bottom: 16px" v-for="(e, index) in changedInfo" :key="index" v-show="show" :info="e" :start_time="e.start" :end_time="e.end" @clear="clear"/>
    </div>
    <div class="save__btn" :class="{'available': saved.length===7, 'notDisplayed':!show}" @click="commitChanges()">
        Сохранить
    </div>
</div>
</template>
<script>
import MenuHeader from '../components/MenuHeader.vue'
import WorkingHours from '../components/WorkingHours.vue'
import PriceSettings from '../components/PriceSettings'
import ChangedCard from '../components/ChangedCard'
import { mapState } from 'vuex'
import axios from 'axios'
export default {
    data() {
        return{
            isDaySelected: false,
            sendData: {},
            selectedDaysF: [],
            selectedDays: [],
            isDayOff: false,
            workingHours: [],
            changedInfo: [],
            saved: [],
            show: true,
            showInfo: false,
            daysToChange: [],
            url: window.location.origin.replace('playfields.', '')
        }
    },
    mounted(){
        window.scrollTo(0,0)
    },
    created(){
        let pd = this.playfield.periods_data;
        this.saved = Object.keys(pd);
        pd.forEach((e, index)=>this.sendData[`${index}`] = pd[`${index}`]);
        pd.forEach((e)=> {
          let k = Object.keys(e.prices);
          k = k.slice(k.indexOf(e.start_time)).concat(k.slice(0, k.indexOf(e.start_time)));
          const v = {}
          k.forEach(t => v[t] = e.prices[t]);
          e.prices = v;
        });
        let arr = [];
        this.saved.forEach(key=>{
            if(!arr.includes(JSON.stringify(pd[key]))){
                arr.push(JSON.stringify(pd[key]))
            }            
        });
        arr.forEach(e=>{
            let a = []
            pd.filter((el, index)=>{if(JSON.stringify(el)===e) a.push(`${index}`)});
          
            if(pd[a[0]].dayoff){
                this.changedInfo.push({dayOff: true, selectedDays: a})
            }
            else{
                let prices = Object.values(pd[a[0]].prices);
                let pricesKeys = Object.keys(pd[a[0]].prices);
                let holder = 0;
                let info = []
                for(let i = 1;i<prices.length;i++){
                    if(prices[holder]!==prices[i]){
                        info.push({start_time: {text: pricesKeys[holder], value: pricesKeys[holder]}, end_time: {value:pricesKeys[i], text: pricesKeys[i]}, price: prices[holder]})
                        holder = i;
                    }
                }
                
                info.push({start_time: {text: pricesKeys[holder], value: pricesKeys[holder]}, end_time: {value: pd[a[0]].end_time, text: pd[a[0]].end_time}, price: prices[holder]})
                this.changedInfo.push({dayoff: false, selectedDays: a, start: pd[a[0]].start_time, end:pd[a[0]].end_time, info:info})
            }

        })
    },
    components: {MenuHeader, WorkingHours, PriceSettings, ChangedCard},
    methods:{
        clear(info){
            this.selectedDays = this.selectedDays.filter(e=>!info.selectedDays.includes(e));
            this.saved = this.saved.filter(e=>!info.selectedDays.includes(e));
            Object.keys(this.sendData).forEach(e=>{
                if(!this.saved.includes(e)){
                    delete this.sendData[e];
                }
            }) 
            this.changedInfo = this.changedInfo.filter(e=>JSON.stringify(e)!==JSON.stringify(info));
            this.showInfo = false;
            this.show = true;
        },
        dayFormat(days){
            return days.map(e=>{
                switch(e){
                    case '1':
                        return 'Пн';
                    case '2':
                        return 'Вт';
                    case '3':
                        return 'Ср';
                    case '4':
                        return 'Чт';
                    case '5':
                        return 'Пт';
                    case '6':
                        return 'Сб';
                    case '0':
                        return 'Вс';
                }
            });
        },
        dayFormatReversed(days){
            return days.map(e=>{
                switch(e){
                    case 'Пн':
                        return '1';
                    case 'Вт':
                        return '2';
                    case 'Ср':
                        return '3';
                    case 'Чт':
                        return '4';
                    case 'Пт':
                        return '5';
                    case 'Сб':
                        return '6';
                    case 'Вс':
                        return '0';
                }
            });
        },
        daySelected(selectedDays, isDayOff, workingHours){
            this.show = false;
            this.selectedDays = selectedDays;
            this.selectedDaysF = this.dayFormat(selectedDays)
            this.isDayOff = isDayOff;
            this.workingHours = workingHours;

            if(this.isDayOff){
                this.showInfo = true;
                this.show = true;
                this.saved.push(...selectedDays);
                this.changedInfo.push({'dayOff': this.isDayOff, 'selectedDays': this.selectedDays})
                this.selectedDays.forEach(e=>{
                    this.sendData[e] = {'dayoff': true}
                })
            }
        },
        readyToChange(info, start, end, sendData){
            this.changedInfo.push({'info': info, 'dayOff': this.isDayOff, 'selectedDays': this.selectedDays, start: start, end: end});
            this.selectedDays.forEach(e=>{
                this.sendData[[e]] = {
                    'start_time': start,
                    'end_time':end,
                    'prices': {...sendData},
                    'dayoff': false
                }
            });
            this.saved.push(...this.selectedDays)
            this.selectedDays = [];
            this.selectedDaysF = [];
            this.show = true;
            this.showInfo = true;
        },
         async commitChanges(){
            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/playfield/${this.playfield.id}/update-data`, {periods_data: this.sendData},
            {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(e=>
            {
                if(e.status===200){
                    this.$router.push({name: 'myFacility', params: {id: this.facility.id}})
                }
            });
    
        }, back(){
            this.$router.go(-1);
        }
    },
    computed: {
        ...mapState('playfield', ['playfield']),
        ...mapState('facility', ['facility'])
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
.field__setting{
    min-height: 100vh;
    background: #E5E5E5;
    position: relative;
}
.field__text{
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    padding: 16px;
    margin: 16px 0px;
    background: #fff;
}
.save__btn{
    margin-left: 16px;
    margin-bottom: 24px;
    margin-top: 16px;
    width: 84px;
    background: #C4C4C4;
    padding: 5px 7px;
    pointer-events: none;
}
.notDisplayed{
    display: none;
}
.available{
    background: #000;
    color: #fff;
    pointer-events: initial;
}
</style> 