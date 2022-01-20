<template>
    <div class="longTermOrder">
        <order-header>
            <template v-slot:orderHeader>
                <p class= "new__order">Новый заказ</p>
                <div class="close__order">
                    <i class="fa fa-times-circle" aria-hidden="true" @click="goBack()"></i>
                </div>
            </template>
        </order-header>
        <div class="info">
            <p class="order__type">{{order.type?'Разовая бронь':'Долгосрочная бронь'}}</p>
            <p class="start__date">{{order.start_date.format('dddd')}}, {{booking.start_time}} - {{booking.end_time}}</p>
            <p class="price">Цена: {{booking.price}} ₸</p>
            <p class="field">{{booking.pf_name}}</p>
            <p class="cancel_time">Время отмены: {{getCancelTime}}</p>
        </div>
        <div class="order__period">
            <p class="title">Период бронирования</p>
            <div class="order__periods">
                <div class="start__period">
                    <p class="start__title">Дата начала</p>
                    <date-picker v-model="startDate" format = "D MMMM, dd" style="width: 100%;height:40px" :placeholder="startDate" disabled></date-picker>
                </div>
                <div class="end__period">
                    <p class="end__title">Дата окончания</p>
                    <drop-down :options="getEndDateOptions" :initialValue ="getEndDateOptions[0]" @selected="change" :id="'end'"/>
                </div>
            </div>
        </div>
        <div class="continue__button" @click="continueOrder()" :class="{'available':endDate}">
            Продолжить
        </div>
    </div>
</template>
<script>
import OrderHeader from '../components/OrderHeader.vue'
import {mapState} from 'vuex'
import * as dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/ru'
import DatePicker from 'vue2-datepicker';
import DropDown from '../components/DropDown.vue'
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/ru'
export default {
    components: {
        OrderHeader, DatePicker, DropDown
    },
    data(){
        return{
            startDate: '',
            endDate: '',
        }        
    },
    mounted(){
        window.scrollTo(0,0)
        dayjs.extend(customParseFormat)
        this.startDate = this.getDateFormat(this.order.start_date);
        this.endDate = this.getEndDateOptions[0].value;
        this.$store.dispatch('order/setDate', {start_date: this.order.start_date, end_date: this.endDate});
    },
    computed: {
        ...mapState('order', ['order']),
        ...mapState('booking', ['booking']),
        ...mapState('facility', ['facility']),
        getEndDateOptions(){
            const options = [];
            let d = this.order.start_date.add(7, 'day');
            for(let i = 0;i<=52;i++){
                options.push({value:d, text:this.getDateFormat(d)});
                d = d.add(7, 'day')
            }
            return options
        },
        getCancelTime(){
          let cancel_time = this.order.type?this.facility.single_payment.cancel_time:this.facility.multiple_payment.cancel_time;
          return cancel_time===0?'В любое время':` за ${Math.floor(parseInt(cancel_time)/3600)} ч.`;
        }
    },
    methods: {
        getDateFormat(date){
            return dayjs(date).format('DD MMMM, dd')
        },
        goBack(){
            this.$store.dispatch('order/resetState');
            this.$store.dispatch('booking/resetState');
            this.$router.push({path: '/'});
        },
        continueOrder(){
            this.$store.dispatch('order/setDate', {start_date: this.order.start_date, end_date: this.endDate});
            this.$router.push({path: '/availableBookings'})
        },
        change(option, id){
            if(id==='end'){
                this.endDate = option.value;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
:not(i){
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
}
.longTermOrder{
    background: #E5E5E5;
    min-height: 100vh;
}
.info, .order__period{
    padding: 16px 12px;
    .order__type{
        font-weight: 500;
        margin-bottom: 8px;
    }
}
.order__period{
    .title{
        font-weight: 500;
    }
}
.order__periods{
    display: flex;
    margin-top: 8px;
    justify-content: space-between;
     .start__period, .end__period{
        width: 50%;
    }
}
.continue__button{
    margin-left: 12px;
    margin-top: 16px;
    background: #B3B3B3;
    pointer-events: none;
    padding: 5px 7px;
    display: inline-block;
    border: 1px solid #9D9D9D;
}
.available{
    pointer-events: inherit;
    background: #fff;
}
</style>