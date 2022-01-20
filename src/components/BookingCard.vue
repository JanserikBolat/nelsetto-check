<template>
    <div class="booking__card">
        <div class="bookingCard__inner">
            <div class="booking__time">
                <p class="time key">Время брони:</p>
                <p class="time value">{{booking.start_time.substring(0,5)}}-{{booking.end_time.substring(0,5)}}</p>
            </div>
            <div class="booking__field">
                <p class="field key">Площадка:</p>
                <p class="field value">{{booking.playfield.name}}</p>
            </div>
            <div class="booking__price">
                <p class="price key">Стоимость:</p>
                <p class="price value">{{booking.price}} тг</p>
            </div>
            <div class="booking__paytype">
                <p class="paytype key">Способ оплаты</p>
                <p class="paytype value">{{order.payment_type==='cash'?"Наличными":"По реквизитам"}}</p>
            </div>
            <div class="booking__discount">
                <p class="discount key">Сумма скидки:</p>
                <p class="discount value">{{booking.discount}} тг</p>
            </div>
            <div v-show="booking.debt>0&&orderValid" class="discount__button" @click="addDiscount()">
                Добавить скидку
            </div>
            <div class="booking__paid">
                <p class="paid key">Оплачено:</p>
                <p class="paid value">{{booking.paid}} тг</p>
            </div>
            <div v-show="booking.debt>0&&orderValid" class="pay__button" @click="addPay()">
                Добавить оплату
            </div>
            <div class="booking__remaining">
                <p class="remaining key">{{booking.status==='completed'?'Долг':'Остаток'}}</p>
                <p class="remaining value">{{booking.debt}} тг</p>
            </div>
        </div>
        <payment-popup v-show="show" @addPayment="addPayment" @closePayment="closePayment" :remain="booking.debt" :is_crm="order.client.is_crm">
            <template v-slot:title>
                    <p v-if="active==='payment'">Добавьте оплату</p>
                    <p v-if="active==='discount'">Добавьте скидку</p>
                </template>
        </payment-popup>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import PaymentPopup from './PaymentPopup.vue'
export default {
    data(){
        return{
            show: false,
            active: 'payment',
        }
    },
  components: { PaymentPopup },
    methods: {
        addPayment(money){
            switch(this.active){
                case 'payment':
                    this.$store.dispatch('booking/setBookingPaid', {money: money, id:this.booking.id});
                    break;
                case 'discount':
                    this.$store.dispatch('booking/setBookingDiscount', {discount: money, id:this.booking.id});
                    break;
            }
            this.show = false
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
        ...mapState('booking', ['booking']),
        ...mapState('order', ['order']),
        orderValid(){
            return this.booking.status==='completed'||this.booking.status==='activated'
        }
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