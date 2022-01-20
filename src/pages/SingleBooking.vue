<template>
<div class="single__booking">
    <spinner :start="sending"/>
    <div class="single__booking_inner" v-if="!sending">
    <confirm-header  @back="back">
        <template v-slot:main>
                <p class="order__id" @click.stop="goToOrder">Заказ №{{booking.order_id}}</p>
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
    <booking-card v-if="active==='info'" />
    <booking-history v-if="active==='history'" :logs="logs"/>
    <div class="cancel_booking" v-if="active==='info'&&orderValid" @click.stop="goToOrder">Отменить бронь</div>
    <div class="edit" v-if="orderValid&&active==='info'">
        <div class="edit__button" @click="goToEdit()">Редактировать</div>
    </div>
    </div>
</div>
</template>
<script>
import ConfirmHeader from '../components/ConfirmHeader.vue'
import BookingCard from '../components/BookingCard.vue'
import BookingHistory from "../components/BookingHistory";
import {mapState} from 'vuex'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import axios from 'axios'
import Spinner from "../components/Spinner";
export default {
    props: ['id', 'bookingid'],
    data(){
        return{
            active: 'info',
            url: window.location.origin.replace('playfields.', ''),
            logs: [],
            sending: true,
        }
    },
    mounted(){
        window.scrollTo(0,0)
        this.getSingleBooking()
    },
    components: {Spinner, ConfirmHeader, BookingCard, BookingHistory},
    computed: {
        ...mapState('booking', ['booking']),
        ...mapState('order', ['order']),
        getDateFormat(){
            return dayjs(this.booking.date).locale('ru').format('DD MMMM')
        },
        orderValid(){
            return this.booking.status==='activated';
        }
    },
    methods: {
        goToEdit(){
          this.$router.push({name: 'edit', params: {id: this.id, bookingid: this.bookingid}});
        },
        goToOrder(){
          this.$router.push({name: 'singleOrder', params: {id: this.id}});
        },
        back(){
            this.$router.go(-1);
        },
        async getSingleBooking(){
          this.sending = true;
            await axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/reservation/${this.bookingid}`, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(res=>{
                this.$store.dispatch('booking/setBooking', res.data.booking);
                this.$store.dispatch('order/setOrder', res.data.booking.order);
                this.$store.dispatch('order/setClient', res.data.booking.client);
                this.getHistory();
            })
        },
      async getHistory(){
          this.sending = true;
        await axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/reservation/${this.bookingid}/history`, {
          headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
        }).then(res=>{this.logs = res.data.logs}).finally(()=> this.sending = false);
      }
    }
}
</script>
<style lang="scss" scoped>
.single__booking{
    background:#E5E5E5;
    min-height: 100vh;
    position: relative;
    .cancel_booking{
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
      text-align: center;
      letter-spacing: 1.25px;
      text-transform: uppercase;
      color: #eb6f62;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 16px;
      cursor: pointer;
    }
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
    bottom: 48px;
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