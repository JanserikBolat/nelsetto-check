<template>
    <div class="orderInfo__popup">
        <div class="orderInfo__inner">
            <div class="orderInfo__top">
                <div class="orderInfo__left">
                    <div class="order__number" @click.stop = goToOrder>
                        Заказ №{{info.order_id}}
                    </div>
                    <div class="order__remain">
                        Бронь, {{getDate}}
                    </div>
                </div>
                <div class="orderInfo__right">
                    <client-card-mini :client="info.client"/>
                </div>
            </div>
            <div class="orderInfo__content">
                <div class="orderInfo__remain margin-bottom">
                    <div class="orderInfo__key">
                        Осталось броней
                    </div>
                    <div class="orderInfo__value">
                        {{info.other_reservations}}
                    </div>
                </div>
                <div class="orderInfo__details margin-bottom">
                    <div class="orderInfo__key">
                        Детали 
                    </div>
                    <div class="orderInfo__value">
                        {{info.start_time.substring(0,5)}}-{{info.end_time.substring(0,5)}}, Площадка {{info.playfield_id}} 
                    </div>
                </div>
                <div class="orderInfo__cost margin-bottom">
                    <div class="orderInfo__key">
                        Общая сумма
                    </div>
                    <div class="orderInfo__value">
                        {{info.price}}
                    </div>
                </div>
                <div class="orderInfo__payType margin-bottom">
                    <div class="orderInfo__key">
                        Способ оплаты
                    </div>
                    <div class="orderInfo__value">
                        {{info.pay__type==="cash"?'Наличными':'По реквизитам'}}
                    </div>
                </div>
                <div class="orderInfo__paid margin-bottom">
                    <div class="orderInfo__key">
                        Оплачено
                    </div>
                    <div class="orderInfo__value">
                        {{info.paid}}
                    </div>
                </div>
                <div class="orderInfo_discount margin-bottom">
                    <div class="orderInfo__key">
                        Скидка
                    </div>
                    <div class="orderInfo__value">
                        {{info.discount}}
                    </div>
                </div>
                <div class="orderInfo__payRemain margin-bottom">
                    <div class="orderInfo__key">
                        Остаток
                    </div>
                    <div class="orderInfo__value">
                        {{info.debt}}
                    </div>
                </div>
                <div class="orderInfo__button" @click="goToBooking()">
                    Перейти к брони
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import ClientCardMini from './ClientCardMini.vue'
export default {
  components: { ClientCardMini },
    props: ['info'],
    computed: {
        getDate: function(){
            return dayjs(this.info.date).locale('ru').format('DD MMMM')
        },
        getRemainMoney: function(){
            return this.info.bookingInfo.price-(this.info.bookingInfo.paid+this.info.bookingInfo.booking_discount)
        },
        getRemainBookings: function(){
            let c = 0;
            const d2 = dayjs()
            for(const b in this.info.bookings){
                const d1 = dayjs(this.info.bookings[b].date) 
                if(d1.diff(d2, 'day', false)>=0){
                    c+=1;
                }
            }
            return c;
        }
    },
    methods: {
        goToBooking(){
            this.$store.dispatch('order/setOrder', this.info)
            this.$store.dispatch('booking/setBooking', this.info)
            this.$router.push({name: 'singleBooking', params: {id: this.info.order_id, bookingid: this.info.id}});
        },
        goToOrder(){
            this.$store.dispatch('order/setOrder', this.info)
            this.$store.dispatch('booking/setBooking', this.info)
            this.$router.push({name: 'singleOrder', params: {id: this.info.order_id}});
        }
    }
}
</script>
<style lang="scss" scoped>
*{
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
}
.orderInfo{
    &__popup{
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04);
        z-index: 35;
    }
    &__inner{
        margin: 10px 16px 22px;
    }
    &__top{
        display: flex;
        justify-content: space-between;
    }
    &__left{
        width: 50%;
    }
    &__right{
        width: 133px;
    }
    &__button{
        width: 100%;
        height: 36px;
        background: #000;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
}
.order__number{
        font-weight: 700;
        text-decoration: underline;
        cursor: pointer;
    }
.margin-bottom{
        margin-bottom: 16px;
        display: flex;
        *{
            width: 50%;
        }
    }
</style>