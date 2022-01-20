<template>
    <div class="playfield__workingHours" @click.stop="goToWorkingHours()">
        <div class="flex">
            <div class="flex__key">Режим работы</div>
            <i class="fas fa-chevron-right"></i>
        </div>
        <div class="value">
            <div v-for="value, name in groupBy" :key="name" style="display:flex;gap:2px">
                <p>{{getFormatted(value)}}, </p>
                <p>{{name}}</p>
            </div>
        </div>
    </div>    
</template>
<script>
import dayjs from 'dayjs';
import {mapState} from 'vuex';
export default {
    data(){
        return{
            groupBy: {}
        } 
    },
    created(){
        this.getWorkingHours();
    },
    methods: {
        goToWorkingHours(){
            this.$router.push({name: 'playfieldSettings'})
        },
        getWorkingHours(){
            Object.keys(this.playfield.periods_data).map(key=>{
                let s = this.playfield.periods_data[key].start_time;
                let e = this.playfield.periods_data[key].end_time;
                let kk = s&&e?`${s}-${e}`:'Выходной';
                if(this.groupBy[kk]){
                    this.groupBy[kk].push(key) 
                }
                else{
                    this.groupBy[kk] = [key]
                }
            });
            Object.keys(this.groupBy).map(key=>{
                this.groupBy[key] = this.groupBy[key].sort();
                if(this.groupBy[key][0]==='0'){
                    this.groupBy[key].shift();
                    this.groupBy[key].push('0');
                }
            });
        },
        getFormatted(arr){
            return arr.length===1?this.getDay(arr[0]):`${this.getDay(arr[0])}-${this.getDay(arr[arr.length-1])}`
        },
        getDay(day){
            let d = dayjs().locale('ru').day(day).format('dd')
            return d.replace(d[0], (c) => c.toUpperCase());
        },
    },
    computed: {
        ...mapState('playfield', ['playfield'])
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
}
.playfield{
    &__workingHours{
            padding: 16px;
            background: #fff;
            box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
            .value{ 
                color: rgba(0, 0, 0, 0.6);
            }
            .flex{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
                &__center{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                &__key{
                    font-size: 16px;
                }
                i{
                    color: rgba(0, 0, 0, 0.6);
                }
            }
        }
}
</style>