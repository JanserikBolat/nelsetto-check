<template>
    <div class="popup">
        <div class="popup__inner">
        <div class="popup__order">
            <div class="new__order__wrapper">
                <p class="new__order">Новый заказ</p>
                <p class="order__duration">{{getDuration}}</p>
            </div>
            <div class="close__popup" @click="closePopup">
                <i class="fas fa-times-circle"></i>
            </div>
        </div>
        <div class="order__info">
            <p class="pf_name">{{booking.pf_name}}</p>
            <div class="popup__orderDescription">
                <div class="order__desription">
                    <p class="order__date">{{getDateFormat}}</p>
                    <p class="order__time">{{booking.start_time}} - {{booking.end_time}}</p>
                    <p class="order__cost">{{booking.price}} тг</p>
                </div>
                <select v-model="orderType" class="order__type">
                    <option v-for="type, index in types" :key="index">{{type}}</option>
                </select>
            </div>
        </div>
        <div class="continue__order">
            <div class="continue__button" @click="continueOrder()">Продолжить</div>
        </div>
        </div>
    </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default({
    data(){
        return{
            types: ['Разовая бронь', 'Долгосрочная бронь'], 
            orderType: 'Разовая бронь',
        }
    },
    methods: {
       closePopup(){
           this.$emit('closePopup');
       },
       continueOrder(){
            this.$store.dispatch('order/setType', this.orderType==='Разовая бронь'?1:0);
            this.$store.dispatch('order/setDate', {start_date: this.booking.date, end_date: this.booking.date});
            this.$store.dispatch('order/addBooking', this.getBooking)
           if(this.orderType==='Разовая бронь'){
                this.$router.push({name: 'order'})
            }
            else if(this.orderType==='Долгосрочная бронь'){
                this.$router.push({name: 'longTermOrder'})
            }
       }
   },
   computed:{
        ...mapState('booking', ['booking']),
        ...mapState('facility', ['facility']),
        ...mapGetters('booking', ['getBooking', 'getDuration']),
       getDateFormat(){
           return dayjs(this.booking.date).format('DD MMMM, dd');
       }
   }
})
</script>
<style lang = "scss" scoped>
.popup{
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04);
    z-index: 35;
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-size: 14px;
    line-height: 20px;
    &__inner{
        position: relative;
    }
    &__order{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 16px;
        .new__order__wrapper{
            display: flex;
            font-weight: 500;
            font-size: 20px;
            line-height: 32px;
            .order_duration{
                color: rgba(0, 0, 0, 0.5);
            }
            .new__order{
                margin-right: 12px;
            }
        }
    }
    &__orderDescription{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .order__type{
            height: 34px;
            font-size: 16px;
        }
    }
    .order__info{
        padding: 12px 16px 16px;
    }
    .continue__order{
        padding: 0 16px 12px;
        .continue__button{
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #9D9D9D;
            padding: 5px 0px;
            &hover{
                background: #000;
                color: #fff;
            }
        }
    }
}
</style>
