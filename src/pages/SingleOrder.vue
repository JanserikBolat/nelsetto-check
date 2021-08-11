<template>
    <div class="single__order">
        <div v-if="show" class="backdrop" @click.stop="show = false"></div>
        <ConfirmHeader>
            <template v-slot:main>
                <p class="order__id">Заказ №{{getOrderId}}</p>
            </template>
            <template v-slot:status>
                <p class="order__status">{{order.status}}</p>
            </template>
        </ConfirmHeader>
        <confirmation-card v-show="order.status==='В ожидании'" @updateLocalStorage="updateLocalStorage"/>
        <OrderInfo :buttonNeeded="false">
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
        </OrderInfo>
        <div class="confirm__popup" v-show="show">
            <div class="popup__inner">
                <i class="fas fa-times" @click="show=false"></i>
                <p class="confirm__text">Вы уверены, что хотите отменить все?</p>
            <div class="confirm__buttons">
                <div class="button__yes" @click="cancelOrder(true)">Да</div>
                <div class="button__no" @click="cancelOrder(false)">Нет</div>
            </div>
            </div>
        </div>
        <div class="booking__status">
            <div class="bookingStatus__inner">
                <p>Брони</p>
                <div class="statuses">
                    <div class="upcoming" :class="{'active':active==='upcoming'}" @click="getBookings('upcoming')">
                        Предстоящие
                        <div class="line"></div>
                    </div>
                    <div class="finished" :class="{'active':active==='finished'}" @click="getBookings('finished')">
                        Завершенные
                        <div class="line"></div>
                    </div>
                    <div class="canceled" :class="{'active':active==='canceled'}" @click="getBookings('canceled')">
                        Отмененные
                        <div class="line"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cancel__order" v-show="!isPaid&&!IsArchive&&active==='upcoming'">
            <p class="cancelOrder__btn" @click="show=true">Отменить все</p>
        </div>
        <div class="miniCards" v-show="filteredBookings.length>0">
            <MiniOrderCard @addPayment="addPayment" v-for="booking,index in filteredBookings" :bookingId="booking.bookingId" :key="index"/> 
        </div>
        <div class="noBookings" v-show="filteredBookings.length===0">
            <p v-show="active==='upcoming'">Нет предстоящих заказов</p>
            <p v-show="active==='finished'">Нет завершенных заказов</p>
            <p v-show="active==='canceled'">Нет отмененных заказов</p>
        </div>
        <payment-popup v-if="openPopup" @addPayment="addMoney" @closePayment="closePayment" />
    </div>
</template>
<script>
import {mapGetters, mapState} from 'vuex'
import ConfirmHeader from '../components/ConfirmHeader.vue'
import OrderInfo from '../components/OrderInfo.vue'
import MiniOrderCard from '../components/MiniOrderCard.vue'
import PaymentPopup from '../components/PaymentPopup.vue'
import ConfirmationCard from '../components/ConfirmationCard.vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    data(){
        return{
            openPopup: false,
            orders: JSON.parse(localStorage.getItem('orderInfo')),
            bId: '',
            show: false,
            active: 'upcoming',
            filteredBookings: []
        }
    },
    created(){
        this.getBookings(this.active)
    },
  components: { ConfirmHeader, OrderInfo, MiniOrderCard, PaymentPopup,ConfirmationCard},
  computed: {
      ...mapState('order', ['order']),
      ...mapGetters('order', ['getOrder', 'getAllPaid', 'getRemainMoney']),
      getOrderId: function(){
            if(this.order.orderId.length>5){
                return this.order.orderId.substring(0,5)+'...';
            }
            return this.order.orderId
        },
        isPaid(){
            return this.getAllPaid>0;
        },
        IsArchive(){
            return this.order.status==='Отменено'||this.order.status==='Завершено';
        }
  },
  methods: {
      getBookings(status){
          this.active = status
          switch(this.active){
                case 'upcoming':
                    this.filteredBookings = this.getOrder.bookings.filter(e=>dayjs(e.date).diff(dayjs(), 'day', true)>0&&e.status!=='Отменено') 
                    break
                case 'finished':
                    this.filteredBookings = this.getOrder.bookings.filter(e=>e.status==='Завершено')
                    break
                case 'canceled':
                    this.filteredBookings = this.getOrder.bookings.filter(e=>e.status==='Отменено')
                    break
          }
      },
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
                    this.$store.dispatch('booking/setBookingPaid', money)
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
                if(this.orders[i].orderId===oId){
                    this.orders[i] = order;
                }
            }
            localStorage.setItem('orderInfo', JSON.stringify(this.orders));
        },
        cancelOrder(answer){
            if(answer){
                this.$store.dispatch('order/setStatus', 'Отменено')
                this.getOrder.bookings.forEach(b => b.status = 'Отменено');
                this.updateLocalStorage(this.getOrder);
                this.$store.dispatch('order/resetState');
                this.$store.dispatch('booking/resetState');
                this.$router.push('/orders')
            }
            else this.show = false
        }
  }
}
</script>
<style lang="scss" scoped>
.single__order{
    background: #E5E5E5;
    min-height: 100vh;
}
.cancel__order{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 16px;
    p{
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 24px;
        color: #0066FF;

    }
}
.confirm__popup{
    width: 50%;
    height: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    z-index: 11;
    padding: 20px;
    .popup__inner{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        position: relative;
        i{
            position: absolute;
            top: 0;
            right: 0;
        }
        .confirm__buttons{
            display: flex;
            width: 100%;
            .button__yes, .button__no{
                width: 50%;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
            }
            .button__no{
                background: #50CB93;
            }
            .button__yes{
                background: #BD1616;
            }
    }
}
}
.booking__status{
    height: 88px;
    background: #fff;
    margin: 16px 0px;
    font-family: Roboto;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    padding: 16px 16px 0 16px;
    p{
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
    }
    .statuses{
        height: 48px;
        width: 100%;
        display: flex;
        .upcoming, .canceled, .finished{
            width: 33.3%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }
        .active>.line{
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 2px;
                background: #000;
            }
            .active{
                font-weight: 500;
            }
    }
}
.miniCards, .noBookings{
    padding: 16px 16px 8px 16px;
}
.noBookings{
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