<template>
    <div class="changedCard">
        <div class="changedCard__inner">
            <div class="week__days">
                <div class="day" v-for="day, index in info.selectedDays" :key="index">{{dayFormat(day)}}</div>
            </div>
            <div class="workingHours">
                <p>Режим работы</p>
                <p v-if="!info.dayOff">{{start_time}} - {{end_time}}</p>
                <p v-else-if="info.dayOff" class="dayoff">Выходной день</p>
            </div>
            <div class="schedule" v-if="!info.dayOff">
                <div class="schedule__info" v-for="inf, idx in info.info" :key="idx">
                    <p class="time">{{inf.start_time.text}} - {{inf.end_time.text}}</p>
                    <p class="price">{{inf.price}} ₸</p>
                </div> 
            </div>
            <div class="clear__button" @click="clear">Очистить</div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['info' , 'start_time', 'end_time'],
    methods: {
        clear(){
            this.$emit('clear', this.info, this.start_time, this.end_time)
        },
        dayFormat(day){
                switch(parseInt(day)){
                    case 1:
                        return 'Пн';
                    case 2:
                        return 'Вт';
                    case 3:
                        return 'Ср';
                    case 4:
                        return 'Чт';
                    case 5:
                        return 'Пт';
                    case 6:
                        return 'Сб';
                    case 0:
                        return 'Вс';
                }
        },
    },
}
</script>
<style lang="scss" scoped>
*{
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: #000;
}
.changedCard{
    padding: 16px;
    background: #fff;
}
.schedule__info{
    display: flex;
    justify-content: space-between;
    align-items: center;
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
        background-color: #000;
        color: #fff;
        margin-right: 8px;
    }
}
.workingHours{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.clear__button{
    margin-top: 16px;
    padding: 5px 7px;
    background: #000;
    color: #fff;
    display: inline-block;
}
</style>