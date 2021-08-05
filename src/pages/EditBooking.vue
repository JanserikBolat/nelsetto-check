<template>
    <div class="edit__booking">
        <confirm-header>
            <template v-slot:main>
                <p class="order__id">Редактирование</p>
            </template>
            <template v-slot:date>
                <p class="order__date">Бронь, {{getDateFormat}}</p>
            </template>
        </confirm-header>
        <edit-card @hasChanged="hasChangedMethod"/>
        <div class="save">
            <div class="save__button" @click="hasChanged&&saveChanges()" :class="hasChanged?'changed':'notChanged'">Сохранить</div>
        </div>
    </div>
</template>
<script>
import ConfirmHeader from '../components/ConfirmHeader.vue'
import EditCard from '../components/EditCard.vue'
import {mapGetters, mapState} from 'vuex'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    data(){
        return{
            hasChanged: false,
            changed: {},
            orders: JSON.parse(localStorage.getItem('orderInfo'))
        }
    },
    components: {ConfirmHeader, EditCard},
    computed:{
        ...mapState('booking', ['date', 'bookingId']),
        ...mapState('order', ['order']),
        ...mapGetters('order', ['getOrder']),
        ...mapGetters('booking', ['getBooking']),
        getDateFormat(){
            return dayjs(this.date).locale('ru').format('DD MMMM')
        },
    },
    methods: {
        saveChanges(){
            this.$store.dispatch('booking/setBookingTime', this.changed.time)
            this.$store.dispatch('booking/setBookingPrice', this.changed.price)
            this.$store.dispatch('booking/setBookingDate', this.changed.date)
            this.$store.dispatch('booking/setBookingField', this.changed.field_id)
            this.$store.dispatch('booking/setDuration', this.changed.duration)

            for(let i = 0;i<this.getOrder.bookings.length;i++){
                if(this.getOrder.bookings[i].bookingId===this.bookingId){
                    const localBookings = this.getOrder.bookings;
                    localBookings[i] = this.getBooking
                    this.$store.dispatch('order/replaceBooking', localBookings);
                    break;
                }
            }
            this.updateLocalStorage(this.getOrder);
        },
        hasChangedMethod(value, changed){
            this.hasChanged = value;
            this.changed = changed;
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
    }
}
</script>
<style lang="scss" scoped>
.edit__booking{
    min-height: 100vh;
    background: #E5E5E5;
}
.save{
    padding: 0px 16px;
    position: absolute;
    width: 100%;
    bottom: 24px;
    &__button{
        height: 36px;
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
    .changed{
        background: #03A9F4;
    }
    .notChanged{
        background: #9D9D9D;
        pointer-events: none;
    }

}
</style>