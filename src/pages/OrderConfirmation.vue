<template>
    <div class="confirmation__wrapper">
        <div v-if="show" class="backdrop" @click.stop="show = false"></div>
        <confirm-header @back="back">
            <template v-slot:main>
                <p class="order__id">Заказ №{{getOrderId}}</p>
            </template>
            <template v-slot:status>
                <p class="order__status">{{order.status}}</p>
            </template>
        </confirm-header>
        <confirmation-card :fromNelsette="false" @updateLocalStorage="updateLocalStorage" v-show="order.status==='В ожидании'"/>
        
        <order-info :buttonNeeded="false">
            <template v-slot:extraInfo>
                <div class="order__paytype flex">
                    <p class="paytype__key">Способ оплаты</p>
                    <p class="paytype__value">{{order.payment_type==='cash'?"Наличными":"По реквизитам"}}</p>
                </div>
                <div class="order__paid flex">
                    <p class="paid__key">Оплачено</p>
                    <p class="paid__value">{{getAllPaid}} ₸</p>
                </div>
            </template>
        </order-info>
        
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
                        Предстоящие: {{activeCount}}
                        <div class="line"></div>
                    </div>
                    <div class="finished" :class="{'active':active==='finished'}" @click="getBookings('finished')">
                        Завершенные: {{finishedCount}}
                        <div class="line"></div>
                    </div>
                    <div class="canceled" :class="{'active':active==='canceled'}" @click="getBookings('canceled')">
                        Отмененные: {{canceledCount}}
                        <div class="line"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="cancel__order" v-show="!IsArchive&&active==='upcoming'&&order.deposit===0&&containsUnpaid">
            <p class="cancelOrder__btn" @click="show=true">Отменить все</p>
        </div>
        <div class="miniCards" v-show="filteredBookings.length>0">
            <MiniOrderCard @addPayment="addMoney" v-for="booking, index in getOrder.bookings" :key="index" :booking="booking"/>
        </div>
        <div class="noBookings" v-show="filteredBookings.length===0">
            <p v-show="active==='upcoming'">Нет предстоящих заказов</p>
            <p v-show="active==='finished'">Нет завершенных заказов</p>
            <p v-show="active==='canceled'">Нет отмененных заказов</p>
        </div>
    </div>
</template>
<script>
import ConfirmationCard from '../components/ConfirmationCard.vue'
import ConfirmHeader from '../components/ConfirmHeader.vue'
import OrderInfo from '../components/OrderInfo.vue'
import MiniOrderCard from '../components/MiniOrderCard.vue'
import { mapGetters, mapState } from 'vuex'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    data(){
        return{
            orders: JSON.parse(localStorage.getItem('orderInfo')),
            show: false,
            answer: false,
            active: 'upcoming',
            filteredBookings: [],
            activeCount: 0,
            canceledCount: 0,
            finishedCount: 0,
        }
    },
    created(){
        this.getBookings(this.active);
    },
    mounted(){
        window.scrollTo(0,0)
        this.setBookingStatusCount();
    },
    components: {ConfirmHeader, ConfirmationCard, OrderInfo, MiniOrderCard},
    methods: {
        back(){
            this.$router.push({name: 'orders'})
        },
        addMoney(money, bId){
            for(let i = 0;i<this.getOrder.bookings.length;i++){
                if(this.getOrder.bookings[i].bookingId===bId){
                    const localBookings = this.getOrder.bookings;
                    localBookings[i] = {...this.getOrder.bookings[i], paid: this.getOrder.bookings[i].paid+money};
                    this.$store.dispatch('booking/setBookingPaid', money)
                    this.$store.dispatch('order/replaceBooking', localBookings);
                    break;
                }
            }
            this.updateLocalStorage(this.getOrder);
        },
        cancelOrder(answer){
            if(answer){
                this.getOrder.bookings.forEach(b => {
                    if(b.paid===0&&this.isMoreThanSevenDays(b.date)){
                        b.status = 'Отменено'
                        }});
                if(this.allBookingsCanceled){
                    this.$store.dispatch('order/setStatus', 'Отменено')
                }
                this.updateLocalStorage(this.getOrder);
                this.$store.dispatch('order/resetState');
                this.$store.dispatch('booking/resetState');
                //this.$router.push('/orders')
            }
            else this.show = false
        },
        updateLocalStorage(order){
            let oId = order.orderId;
            for(let i=0;i<this.orders.length;i++){
                if(this.orders[i].orderId==oId){
                    this.orders[i] = order;
                }
            }
            localStorage.setItem('orderInfo', JSON.stringify(this.orders));
            this.getBookings(this.active);
            this.setBookingStatusCount();
        },
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
      isMoreThanSevenDays(date){
            return dayjs(date).diff(dayjs())>7
        },
        setBookingStatusCount(){
            this.activeCount = this.getOrder.bookings.filter(b=>b.status==='Потверждено'||b.status==='В ожидании').length;
            console.log(this.activeCount)
            this.canceledCount = this.getOrder.bookings.filter(b=>b.status==='Отменено').length;
            this.finishedCount = this.getOrder.bookings.filter(b=>b.status==='Завершено').length;
        }
    },
    computed: {
    ...mapState('order', ['order']),
    ...mapGetters('order', ['getAllPaid', 'getOrder']),
    ...mapGetters('booking', ['getRemainMoney']),
        getBooking(){
            return this.getOrder.bookings.filter(e=>e.bookingId===this.bId)[0]
        },
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
        },
        allBookingsCanceled(){
            const initial = this.getOrder.bookings.length;
            return this.getOrder.bookings.filter(b=>b.status==='Отменено').length===initial;
        },
        containsUnpaid(){
            return this.filteredBookings.filter(e=>e.paid===0).length!==0
        },
    }
}
</script>
<style lang="scss" scoped>
*{
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
}
.confirmation__wrapper{
    background: #E5E5E5;
    min-height: 100vh;
}
.cancel__order{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 16px;
    p{
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
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
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
.miniCards{
    padding: 16px 16px 8px 16px;
}
.noBookings{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
}
</style>