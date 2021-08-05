<template>
<div class="single__booking">
    <confirm-header>
        <template v-slot:main>
                <p class="order__id">Заказ №{{getOrderId}}</p>
            </template>
        <template v-slot:date>
            <p class="order__date">Бронь, {{getDateFormat}}</p>
        </template>
    </confirm-header>
    <div class="toggle__mode">
        <div class="information" :class="active==='info'?'active':''" @click="active='info'">
            Информация
            <div class="bottomLine"></div>
        </div>
        <div class="history" :class="active==='history'?'active':''" @click="active='history'">
            История
            <div class="bottomLine"></div>
        </div>  
    </div>
    <booking-card v-show="active==='info'" />
    <div class="edit">
        <div class="edit__button" @click="goToEdit()">Редактировать</div>
    </div>
</div>
</template>
<script>
import ConfirmHeader from '../components/ConfirmHeader.vue'
import BookingCard from '../components/BookingCard.vue'
import {mapState} from 'vuex'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    data(){
        return{
            active: 'info'
        }
    },
    components: {ConfirmHeader, BookingCard},
    computed: {
        ...mapState('booking', ['date', 'bookingId']),
        ...mapState('order', ['order']),
        getDateFormat(){
            return dayjs(this.date).locale('ru').format('DD MMMM')
        },
        getOrderId: function(){
            if(this.order.orderId.length>5){
                return this.order.orderId.substring(0,5)+'...';
            }
            return this.order.orderId
        }
    },
    methods: {
        goToEdit(){
            this.$router.push({path:`/order/:${this.order.orderId}/booking/:${this.bookingId}/edit`})
        }
    }
}
</script>
<style lang="scss" scoped>
.single__booking{
    background:#E5E5E5;
    min-height: 100vh;
    position: relative;
}
.toggle__mode{
    display: flex;
}
.information, .history{
    width: 50%;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #F9F9F9;
    color: #90A4AE;
    position: relative;
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 1.25px;
    text-transform: uppercase;

}
.bottomLine{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: #03A9F4;
    display: none;
}
.active{
    color: #03A9F4;
    background: #fff;
    box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.05);
    .bottomLine{
        display: block;
    }
}
.edit{
    padding: 0px 16px;
    position: absolute;
    width: 100%;
    bottom: 24px;
    &__button{
        height: 36px;
        background: #03A9F4;
        border-radius: 4px;
        color: #FFFFFF;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        letter-spacing: 1.25px;
        text-transform: uppercase;
    }

}
</style>