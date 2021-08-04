<template>
    <div class="booking__card">
        <div class="bookingCard__inner">
            <div class="booking__time">
                <p class="time key">Время брони:</p>
                <p class="time value">{{start_time}}-{{end_time}}</p>
            </div>
            <div class="booking__field">
                <p class="field key">Площадка:</p>
                <p class="field value">Площадка {{field_id}}</p>
            </div>
            <div class="booking__price">
                <p class="price key">Стоимость:</p>
                <p class="price value">{{price}} тг</p>
            </div>
            <div class="booking__paytype">
                <p class="paytype key">Способ оплаты</p>
                <p class="paytype value">{{order.pay_type==='cash'?"Наличными":"По реквизитам"}}</p>
            </div>
            <div class="booking__discount">
                <p class="discount key">Сумма скидки:</p>
                <p class="discount value">{{booking_discount}} тг</p>
            </div>
            <div v-show="getRemainMoney>0" class="discount__button" @click="addDiscount()">
                Добавить скидку
            </div>
            <div class="booking__paid">
                <p class="paid key">Оплачено:</p>
                <p class="paid value">{{paid}} тг</p>
            </div>
            <div v-show="getRemainMoney>0" class="pay__button" @click="addPay()">
                Добавить оплату
            </div>
            <div class="booking__remaining">
                <p class="remaining key">Остаток:</p>
                <p class="remaining value">{{getRemainMoney}} тг</p>
            </div>
        </div>
        <payment-popup v-show="show" @addPayment="addPayment" @closePayment="closePayment"/>
    </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import PaymentPopup from './PaymentPopup.vue'
export default {
    data(){
        return{
            show: false,
            active: 'payment',
            orders: JSON.parse(localStorage.getItem('orderInfo'))
        }
    },
  components: { PaymentPopup },
    methods: {
        addPayment(money){
            switch(this.active){
                case 'payment':
                    this.$store.dispatch('booking/setBookingPaid', money);
                    break;
                case 'discount':
                    this.$store.dispatch('booking/addBookingDiscount', money);
                    break;
            }
            for(let i = 0;i<this.getOrder.bookings.length;i++){
                if(this.getOrder.bookings[i].bookingId===this.bookingId){
                    const localBookings = this.getOrder.bookings;
                    localBookings[i] = this.getBooking
                    this.$store.dispatch('order/replaceBooking', localBookings);
                    break;
                }
            }
            this.updateLocalStorage(this.getOrder);
            this.show = false
        },
        updateLocalStorage(order){
            let oId = order.orderId;
            for(let i=0;i<this.orders.length;i++){
                if(this.orders[i].orderId==oId){
                    this.orders[i] = order;
                }
            }
            localStorage.setItem('orderInfo', JSON.stringify(this.orders));
        },
        closePayment(){
            this.show = false;
        },
        addPay(){
            this.show = true;
            this.active = 'payment';
        },
        addDiscount(){
            this.show = true;
            this.active = 'discount';
        }
    },
    computed: {
        ...mapState('booking', ['bookingId','start_time', 'end_time', 'field_id', 'booking_discount', 'price', 'paid']),
        ...mapState('order', ['order']),
        ...mapGetters('booking', ['getRemainMoney', 'getBooking']),
        ...mapGetters('order', ['getOrder'])
    }
}
</script>
<style lang="scss" scoped>
*{
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #222222;
}
.booking{
    &__card{
        padding: 8px 16px;
        background: #fff;
    }
    &__date, &__time, &__field, &__price, &__paytype, &__discount, &__paid, &__remaining{
        display: flex;
        margin-top: 8px;
        .key, .value{
            width: 50%;
        }
        .value{
            text-align: right;
        }
    }
}
.pay__button, .discount__button{
    width: 100%;
    height: 32px;
    margin-top: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.04);
    border: 0.3px solid rgba(0, 0, 0, 0.5);
}
</style>