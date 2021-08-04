<template>
    <div class = "mainHeader">
        <div class="mainHeader__inner">
            <div class="mainHeader__top">
                <p>Расписание</p>
                <div class="mainHeader__filters" >
                    <div @click ='setFilter("oneDay")' class="filter__day" :class="active==='oneDay'?'active':''">
                        <p>День</p>
                    </div>
                    <div @click ='setFilter("allTime")' class="filter__allTime" :class="active==='allTime'?'active':''">
                        <p>Все время</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    props: ['filterType'],
    data(){
        return{
            active: this.filterType,
            day: dayjs().locale('ru'),
            
        }
    },
    created(){
        this.setFilter(this.filterType);
    },
    methods: {
        setFilter(filter){
            this.active = filter
            if(this.active==='oneDay'){
                this.$router.push({path: '/'})   
            }
            else if(this.active==='allTime'){
                this.$router.push({path: '/allTime', name: 'main'})
            }
        }
    }
}
</script>
<style lang="scss" scoped>
*{
    margin: 0;
    padding: 0;
}
.mainHeader{
    position: fixed;
    z-index: 20;
    top: 0;
    left: 0;
    right: 0;
    height: 93px;
    background: #FFFFFF;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04);
    &__inner{
        padding-left: 16px;
        padding-top: 10px;
    }
    &__top{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    &__filters{
        display: flex;
        justify-content: space-between;
        margin-right: 10px;
    }
}
.filter{
    &__day{
        width: 48px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0.5px solid black;
        margin-right: 4px;
        cursor: pointer;
        p{
            font-family: 'Roboto', sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 20px;
            text-align: center;
            color: #000000;
        }
    }
    &__allTime{
        width: 83px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0.5px solid black;
        cursor: pointer;
        p{
            font-family: 'Roboto', sans-serif;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 20px;
            text-align: center;
            color: #000000;
        }
    }
}
.active{
    background: #A9A9A9;
}
</style>
