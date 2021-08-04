<template>
    <div class="mini__card" @click="goToBookingCard()">
        <div class="miniCard__inner">
            <div class="miniCard__top">
                <span class="order__date">{{capitalizeAndFormat(getBooking.date)}}</span>
                <span class="order__edit"><i class="fas fa-pen"></i></span>
            </div>
            <div class="miniCard__bottom">
                <div class="bottom__description">
                    <p>{{getBooking.start_time}} - {{getBooking.end_time}}</p>
                    <p>Площадка {{getBooking.field_id}}</p>
                    <p>Остаток:  {{getRemainMoney}}₸</p>
                </div>
                <div class="bottom__payment" @click="addPayment()" v-if="getRemainMoney>0">
                    Добавить оплату
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import {mapGetters, mapState} from 'vuex'
export default {
    props: ['bookingId'],
    data(){
        return{
            orders: JSON.parse(localStorage.getItem('orderInfo')), 
        }
    },
    methods: {
        capitalizeAndFormat(s){
            s = dayjs(s).locale('ru').format('dd, DD MMMM')
            return s.replace(s[0],s[0].toUpperCase())
        },
        addPayment(){
            console.log("AA")
            this.$emit('addPayment', this.bookingId)
        },
        goToBookingCard(){
            console.log('A')
            this.$router.push({path:`/order/:${this.order.orderId}/:${this.bookingId}`})
        
        }
    },
    computed: {
        ...mapGetters('order', ['getOrder']),
        ...mapState('order', ['order']),
        ...mapGetters('booking', ['getRemainMoney']),
        getBooking(){
            return this.getOrder.bookings.filter(e=>e.bookingId===this.bookingId)[0]
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
.mini__card{
    margin: 16px 16px 8px 16px;
    background: #fff;
    padding: 8px 8px 16px 8px;
}
.miniCard__top{
    display: flex;
    justify-content: space-between;
    align-self: center;
    margin-bottom: 12px;;
}
.miniCard__bottom{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.order__date{
    line-height: 24px;
    font-weight: 500;
}
.bottom__description{
    p{
        font-size: 12px;
        line-height: 14px;
    }
}
.bottom__payment{
    padding: 4px 24px;
    background: rgba(0, 0, 0, 0.04);
    border: 0.3px solid rgba(0, 0, 0, 0.5); 
    cursor: pointer;
}
</style>