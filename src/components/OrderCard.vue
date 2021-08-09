<template>
    <div class="order__card" @click="singleOrder()">
        <div class="orderCard__inner">
            <div class="card__little">
                <div class="little__left">
                    <p class="order__id">Заказ №{{order.orderId.substring(0,3)}},<p> 
                    <p class="booking__amount"> {{getBookingAmount}} бронь</p>
                </div>
                <div class="little__status">
                    <p v-show="order.status==='В ожидании'" class="status waiting">Ожидает потверждения</p>
                    <p v-show="order.status==='Завершено'" class="status finished">Завершен</p>
                    <p v-show="order.status==='Отменено'" class="status canceled">Отменен</p>
                    <p v-show="order.status==='Потверждено'" class="status confirmed">Подтвержден</p>
                </div>
            </div>
            <div class="card__content">
                <div class="content__left">
                    <p class="date">{{formatDate(order.start_date)}} - {{formatDate(order.end_date)}}</p>
                    <p class="time">{{getTime}}</p>
                    <p class="field">Площадка №{{getField}}</p>
                </div>
                <div class="content__right">
                    <ClientCardMini :order="order"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import ClientCardMini from '../components/ClientCardMini.vue'
export default {
    props: ['order'],
    components:{
        ClientCardMini
    },
    data(){
        return{
            show: false
        }
    },
    methods: {
        formatDate(date){
            return dayjs(date).locale('ru').format('DD MMMM')
        },
        singleOrder(){
            this.$store.dispatch('order/setOrder', this.order)
            this.$store.dispatch('booking/setBooking', this.order.bookings[0])
            this.$router.push({path:`/order/:${this.order.orderId}`})
        },
        closePopup(){
            this.show = false;
        }
    },
    computed: {
        getTime(){
            return `${this.order.bookings[0].start_time}-${this.order.bookings[0].end_time}`
        },
        getField(){
            return this.order.bookings[0].field_id
        },
        getBookingAmount(){
            return this.order.bookings.length
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
}
.order__card{
    background: #fff;
    margin-bottom: 16px;
    .orderCard__inner{
        padding: 8px 0px 16px 16px;
    }
}
.card{
    &__content{
        display: flex;
        align-items: center;
    }
}
.content{
        &__left, &__right{
            width: 50%;
        }
        &__right{
            display: flex;
            justify-content: flex-end;
        }
    }
.user__description{
    width: fit-content;
    padding: 9.67px;
    min-height: 36px;
}
.card__little{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .little__left{
        display: flex;
        margin-bottom: 8px;
    }
    .order__id{
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.15px;
    }
    .booking__amount{
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.15px;
    }
    .status{
        font-size: 10px;
        padding-right: 10px;
    }
    .waiting{
        color: #E3B205;
    }
    .canceled{
        color: #FF4747;
    }
    .confirmed{
        color: #2DCC70;
    }
    .finished{
        color: #4A4A4A;
    }
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
</style>