<template>
    <div class="orderInfo">
      <div class="backdrop" v-if="discountAdd"></div>
        <div class="orderInfo__inner">
            <div class="orderInfo__info">
                <div class="order__date flex">
                    <p class="order__type">{{order.type?"Разовая бронь":"Период бронирования"}}</p>
                    <p class="date__value">{{getDateFormat(order.start_date)}}{{order.type?'':` - ${getDateFormat(order.end_date)}`}}</p>
                </div>
                <div class="order__details flex">
                    <p class="details__key">Детали</p>
                    <div class="details__value">
                        <p>{{booking.start_time.substring(0,5)}} - {{booking.end_time.substring(0,5)}}, {{getDayFormat(order.start_date)}}</p>
                        <p>{{getDuration}}({{booking.price}} 	₸)</p>
                    </div>
                </div>
                <div class="order__field flex">
                    <p class="field__key">Площадка</p>
                    <p class="field__value">{{booking.pf_name}}</p>
                </div>
                <div class="order__cost flex">
                    <p class="cost__key">Общая сумма</p>
                    <p class="cost__value">{{getAllCost}} ₸</p>
                </div>
                <slot name="extraInfo"></slot>
                <div class="order__discount">
                    <div class="flex">
                        <p class="discount__key">Скидка</p>
                        <p class="discount__value">{{getAllDiscount}} ₸</p>
                    </div>
                </div>
                <div class="order__remainingPaylaod flex">
                    <p class="remainingPayload__key">Остаток</p>
                    <p class="remaininPayload__value">{{getRemainMoney}} ₸</p>
                </div>
                <div class="order_cancel flex">
                    <p class="cancel__key">Время отмены</p>
                    <p class="cancel__value">{{getCancelTime}}</p>
                </div>
                <div @click="discountAdd=true" class="discount__button" v-if="buttonNeeded&&!orderYourself">
                        Добавить скидку
                </div>
            </div>
            <payment-popup v-show="discountAdd&&!orderYourself"  :remain="getRemainMoney" @addPayment="addPayment" @closePayment="closePayment" :is_crm="orderYourself">
                <template v-slot:title>
                    <p>Добавьте сумму скидки за одну бронь</p>
                </template>
            </payment-popup>
        </div>
    </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import PaymentPopup from './PaymentPopup.vue'
export default {
  components: { PaymentPopup },
    props: ['buttonNeeded', 'orderYourself'],
    data(){
        return{
            discountAdd: false,
            depositAdd: false
        }
    },
  watch:{
    orderYourself: function(value){
      if(value){
        this.$store.dispatch('order/setBookingDiscount', this.booking.price);
        this.$store.dispatch('booking/setBookingDiscountLocal', this.booking.price);
      }
      else{
        this.$store.dispatch('booking/setBookingDiscountLocal', 0);
        this.$store.dispatch('order/setBookingDiscount', 0);
      }
    }
  },
    methods: {
        addPayment(money){
            if(this.discountAdd){
                this.$store.dispatch('order/setBookingDiscount', money);
                this.$store.dispatch('booking/setBookingDiscountLocal', money);
            }
            else if(this.depositAdd){
                this.$store.dispatch('order/addDeposit', money);
            }
            this.discountAdd = false;
            this.depositAdd = false;
        },
        closePayment(){
            this.discountAdd = false;
            this.depositAdd = false;
        },
        addDeposit(){
            this.depositAdd = true;
        },
        getDateFormat(date){
            return dayjs(date).locale('ru').format('DD MMMM');
        },
        getDayFormat(date){
            return dayjs(date).locale('ru').format('dddd');
        }
    }, 
    computed:{
        ...mapState('booking', ['booking']),
        ...mapState('order', ['order']),
        ...mapState('facility', ['facility']),
        ...mapGetters('order', ['getRemainMoney', 'getAllDiscount', 'getAllCost']),
        ...mapGetters('booking', ['getDuration', 'getPlayfieldName']),
        getCancelTime(){
          let cancel_time = this.order.type?this.facility.single_payment.cancel_time:this.facility.multiple_payment.cancel_time;
            return cancel_time===0?'В любое время':` за ${Math.floor(parseInt(cancel_time)/3600)} ч.`
        }
    }
}
</script>
<style lang="scss" scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
}
.orderInfo{
    background: #fff;
    padding: 16px 15px;
    margin-top: 16px;      
}
.flex{
    display: flex;
    margin-bottom: 12px;
}
.flex>*{
    width: 50%;
}
.discount__button, .deposit__button{
    width: 100%;
    height: 28px;
    background: rgba(0, 0, 0, 0.04);
    border: 0.3px solid rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center; 
    align-items: center;
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