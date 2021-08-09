<template>
    <div class="popup">
        <div class="popup__inner">
        <div class="popup__order">
            <div class="new__order__wrapper">
                <p class="new__order">Новый заказ</p>
            </div>
            <div class="order__duration__wrapper">
                <p class="order__duration">{{duration}}</p>
            </div>
            <div class="close__popup" @click="closePopup">
                <div class="close__button"></div>
            </div>
        </div>
        <div class="popup__orderDescription">
            <div class="order__desription">
                <p class="order__date">{{getDateFormat}}</p>
                <p class="order__time">{{start_time}} - {{end_time}}</p>
                <p class="order__cost">{{price}} тг</p>
            </div>
            <select v-model="orderType" class="order__type">
                <option v-for="type, index in types" :key="index">{{type}}</option>
            </select>
        </div>
        <div class="continue__order">
            <button class="continue__button" @click="continueOrder()">Продолжить</button>
        </div>
        </div>
    </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import { uuid } from 'vue-uuid'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default({
    data(){
        return{
            types: ['Разовая бронь', 'Долгосрочная бронь'], 
            orderType: 'Разовая бронь',
            uuid: uuid.v1()
        }
    },
    methods: {
       closePopup(){
           this.$emit('closePopup')
       },
       continueOrder(){
           if(this.orderType==='Разовая бронь'){
               this.$store.dispatch('booking/setBookingId', 1);
               this.$store.dispatch('order/setDate', {start_date: this.date, end_date: this.date})
               this.$store.dispatch('order/addBooking', this.getBooking)
            }
            this.$store.dispatch('order/setType', this.orderType)
            this.$store.dispatch('order/setId', this.getUniqueId)
            this.$router.push({name: 'order'})
       }
   },
   computed:{
        ...mapState('booking', ['date', 'price', 'start_time', 'end_time', 'duration']),
        ...mapGetters('booking', ['getBooking']),
       getUniqueId(){
          const uId = this.$uuid.v4();
          return uId; 
       },
       getDateFormat(){
           return dayjs(this.date).format('DD MMMM, dd');
       }
   }
})
</script>
<style lang = "sass" scoped>
.popup
    position: fixed
    width: 100%
    bottom: 0
    left: 0
    right: 0
    background: #fff
    box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04)
    z-index: 16
    height: 166px
    .popup__inner
        margin: 10px 16px 22px
        position: relative
        .popup__order
            display: flex
            .new__order__wrapper
                width: 123px
                height: 32px
                .new__order
                    margin: 0
                    font-family: 'Roboto', sans-serif
                    font-style: normal
                    font-weight: 500
                    font-size: 20px
                    line-height: 32px
                    color: #000

            .order__duration__wrapper
                width: fit-content
                height: 32px
                margin-left: 12px
                opacity: 0.5
                .order__duration
                    margin: 0
                    font-family: 'Roboto', sans-serif
                    font-style: normal
                    font-weight: 500
                    font-size: 20px
                    line-height: 32px
                    color: #000
            .close__popup
                position: absolute
                width: 24px
                height: 32px
                right: 0
                top: 0
                display: flex
                justify-content: center
                align-items: center
                .close__button
                    width: 20px
                    height: 20px
                    background: #000
                    border-radius: 50%
                    display: flex
                    justify-content: center
                    align-items: center
                .close__button::before, .close__button::after
                    content: ''
                    position: absolute
                    background: #fff
                    width: 2px
                    height: 15px
                .close__button::after
                    transform: rotate(45deg)
                .close__button::before
                    transform: rotate(-45deg)
        .popup__orderDescription
            display: flex
            justify-content: flex-start
            align-items: center
            margin-top: 16px
            .order__date, .order__time, .order__cost
                margin: 0
                font-family: Roboto
                font-style: normal
                font-weight: normal
                font-size: 14px
                line-height: 20px
                color: #000000
            .order__date
                height: 20px
            .order__time
                width: 81px
                height: 20px
            .order__cost
                width: 81px
                height: 20px
            .order__type
                margin-left: 25px
                cursor: pointer
        .continue__order
            display: flex
            justify-content: center
            align-items: center
            .continue__button
                background: #FFFFFF
                border: 1px solid #9D9D9D
                height: 30px
                width: 100%
                text-align: center
            :hover
                background: #000
                color: #fff
                cursor: pointer
</style>
