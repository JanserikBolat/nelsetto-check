<template>
    <div class="orderInfo">
        <div class="orderInfo__inner">
            <div class="orderInfo__info">
                <div class="order__date flex">
                    <p class="order__type">{{isOneTerm?"Разовая бронь":"Период бронирования"}}</p>
                    <p class="date__value">{{isOneTerm?getDateFormat(order.start_date):`${getDateFormat(order.start_date)}-${getDateFormat(order.end_date)}`}}, {{getDayFormat(order.start_date)}}</p>
                </div>
                <div class="order__details flex">
                    <p class="details__key">Детали</p>
                    <div class="details__value">
                        <p>{{start_time}}-{{end_time}}</p>
                        <p>{{duration}}({{price}} 	₸)</p>
                    </div>
                </div>
                <div class="order__field flex">
                    <p class="field__key">Площадка</p>
                    <p class="field__value">№{{field_id}}</p>
                </div>
                <div class="order__cost flex">
                    <p class="cost__key">Общая сумма</p>
                    <p class="cost__value">{{getAllCost}} ₸</p>
                </div>
                <slot name="extraInfo"></slot>
                <div class="order__discount flex">
                    <p class="discount__key">Скидка</p>
                    <p class="discount__value">{{getAllDiscount}} ₸</p>
                </div>
                <div class="order__remainingPaylaod flex">
                    <p class="remainingPayload__key">Остаток</p>
                    <p class="remaininPayload__value">{{getRemainMoney}} ₸</p>
                </div>
            </div>
            <div  @click="buttonClicked()" class="discount__button" v-if="buttonNeeded">
                Добавить скидку
            </div>
            <div class="discount__input" v-if="discountAdd">
                <label for="discount">Пожалуйста, введите сумму скидки <span style="font-weight: 700">на одну бронь</span></label>
                <input type="text" id="discount" v-model="discount" value="" ref="discount__button">
                <button @click="cancelDiscount()">Отмена</button>
                <button @click="addDiscount()">Ок</button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    props: ['buttonNeeded'],
    data(){
        return{
            discount: !this.getAllDiscount?'':this.getAllDiscount,
            discountAdd: false
        }
    },
    methods: {
        buttonClicked(){
            this.discountAdd=true
            this.$refs['discount__button'].focus();
        },
        addDiscount(){
            this.discountAdd = false
            this.$store.dispatch('order/setBookingDiscount', parseInt(this.discount))
            this.$store.dispatch('booking/setBookingDiscount', parseInt(this.discount))
            this.$emit('getDiscount', this.discount);
            this.discount = '';
        },
        cancelDiscount(){
            this.discount = '';
            this.discountAdd = false;
            this.$store.dispatch('order/setBookingDiscount', 0)
            this.$store.dispatch('booking/setBookingDiscount', 0);
            this.$emit('getDiscount', this.discount);
        },
        getDateFormat(date){
            return dayjs(date).locale('ru').format('DD MMM');
        },
        getDayFormat(date){
            return dayjs(date).locale('ru').format('dddd');
        }
    }, 
    computed:{
        isOneTerm: function(){
            return this.order.type==="Разовая бронь"
        },
        ...mapState('booking', ['price', 'start_time', 'end_time', 'field_id', 'duration']),
        ...mapState('order', ['order']),
        ...mapGetters('order', ['getRemainMoney', 'getAllDiscount', 'getAllCost'])
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
    height: max-content;       
}
.flex{
    display: flex;
    margin-bottom: 12px;
}
.flex>*{
    width: 50%;
}
.discount__button{
    width: 100%;
    height: 28px;
    background: rgba(0, 0, 0, 0.04);
    border: 0.3px solid rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center; 
    align-items: center;
}
</style>
<!--
<div class="order__payload flex">
                    <p class="payload__key">Способ оплаты</p>
                    <div class="payload__value">
                        <input type="radio" id="cash" name="payload__type"  checked><label for="cash">Наличными</label><br>
                        <input type="radio" id="card" name="payload__type"><label for="card">По реквизитам</label>
                    </div>
                </div>
                -->