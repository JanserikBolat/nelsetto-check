<template>
    <div class="confirmation__wrapper">
        <confirm-header>
            <template v-slot:status>
                <p class="order__status">{{order.status}}</p>
            </template>
        </confirm-header>
        <confirmation-card :fromNelsette="false" @updateLocalStorage="updateLocalStorage"/>
        <order-info :buttonNeeded="false">
            <template v-slot:extraInfo>
                <div class="order__paytype flex">
                    <p class="paytype__key">Способ оплаты</p>
                    <p class="paytype__value">{{order.pay_type==='cash'?"Наличными":"По реквизитам"}}</p>
                </div>
                <div class="order__paid flex">
                    <p class="paid__key">Оплачено</p>
                    <p class="paid__value">{{getAllPaid}} ₸</p>
                </div>
            </template>
        </order-info>
        <div class="miniCards">
            <MiniOrderCard @addPayment="addPayment" v-for="booking, index in getOrder.bookings" :key="index" :bookingId="booking.bookingId"/>
        </div>
        <payment-popup v-if="openPopup" @addPayment="addMoney" @closePayment="closePayment" />
    </div>
</template>
<script>
import ConfirmationCard from '../components/ConfirmationCard.vue'
import ConfirmHeader from '../components/ConfirmHeader.vue'
import OrderInfo from '../components/OrderInfo.vue'
import MiniOrderCard from '../components/MiniOrderCard.vue'
import PaymentPopup from '../components/PaymentPopup.vue'
import { mapGetters, mapState } from 'vuex'
export default {
    data(){
        return{
            openPopup: false,
            orders: JSON.parse(localStorage.getItem('orderInfo')),
            bId: ''
        }
    },
    components: {ConfirmHeader, ConfirmationCard, OrderInfo, MiniOrderCard, PaymentPopup},
    methods: {
        addPayment(bId){
          this.bId = bId
          this.openPopup = true
        },
        closePayment(){
            this.openPopup = false
        },
        addMoney(money){
            for(let i = 0;i<this.getOrder.bookings.length;i++){
                if(this.getOrder.bookings[i].bookingId===this.bId){
                    const localBookings = this.getOrder.bookings;
                    localBookings[i] = {...this.getOrder.bookings[i], paid: this.getOrder.bookings[i].paid+money};
                    this.$store.dispatch('order/replaceBooking', localBookings);
                    break;
                }
            }
            this.updateLocalStorage(this.getOrder);
            this.openPopup = false
        },
        updateLocalStorage(order){
            let oId = order.orderId;
            for(let i=0;i<this.orders.length;i++){
                if(this.orders[i].orderId==oId){
                    this.orders[i] = order;
                }
            }
            localStorage.setItem('orderInfo', JSON.stringify(this.orders));
        }
        
    },
    computed: {
    ...mapState('order', ['order']),
    ...mapGetters('order', ['getAllPaid', 'getOrder', 'getOrder']),
        getBooking(){
            return this.getOrder.bookings.filter(e=>e.bookingId===this.bId)[0]
        },
        getOrderId: function(){
            if(this.order.orderId.length>5){
                return this.order.orderId.substring(0,5)+'...';
            }
            return this.order.orderId
        }
    }
}
</script>
<style lang="scss" scoped>
.confirmation__wrapper{
    background: #E5E5E5;
    min-height: 100vh;
}

</style>