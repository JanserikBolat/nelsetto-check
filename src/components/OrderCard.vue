<template>
    <div class="order__card" @click="singleOrder()">
        <div class="orderCard__inner">
            <div class="card__little">
                <p class="order__id">Заказ №{{order.orderId.substring(0,3)}},<p> 
                <p class="booking__amount"> {{getBookingAmount}} бронь</p>
            </div>
            <div class="card__content">
                <div class="content__left">
                    <p class="date">{{formatDate(order.start_date)}} - {{formatDate(order.start_date)}}</p>
                    <p class="time">{{getTime}}</p>
                    <p class="field">Площадка №{{getField}}</p>
                </div>
                <div class="content__right">
                    <div class="user__description">
                        <div class="user__photo">
                        <img :src="order.client.photo" alt="" v-if="order.client.photo">
                            <i class="fas fa-user-circle" v-else-if="!order.client.photo"></i>
                        </div>
                        <div class="user__info">
                            <div class="user__name">
                            {{order.client.client_name}}
                        </div>
                        <div class="user__company" v-if="order.client.company!=''">
                            {{order.client.company}}
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    props: ['order'],
    methods: {
        formatDate(date){
            return dayjs(date).locale('ru').format('DD MMMM')
        },
        singleOrder(){
            this.$store.dispatch('order/setOrder', this.order)
            this.$store.dispatch('booking/setBooking', this.order.bookings[0])
            this.$router.push({path:`/order/:${this.order.orderId}`})
        }
    },
    computed: {
        getTime(){
            return `${this.order.bookings[0].start_time}-${this.order.bookings[0].end_time}`
        },
        getField(){
            return this.order.bookings[0].field_id
        },
        getBookingAmount(){
            return this.order.bookings.length
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
.order__card{
    background: #fff;
    padding: 8px 0px 16px 16px;
    margin-bottom: 16px;
}
.card{
    &__content{
        display: flex;
        align-items: center;
    }
}
.content{
        &__left, &__right{
            width: 50%;
        }
        &__right{
            display: flex;
            justify-content: flex-end;
        }
    }
.user__description{
    width: fit-content;
    padding: 9.67px;
    min-height: 36px;
}
.card__little{
    display: flex;
    margin-bottom: 8px;
    .order__id{
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.15px;
    }
    .booking__amount{
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.15px;
    }
}
.user{
    &__description{
        display: flex;
        align-items: center;
        background: rgba(0, 0, 0, 0.04)
    }
    &__photo{
        width: 20px;
        height: 100%;
        margin-right: 12px;
        margin-left: 9.67px;
        display: flex;
        justify-content: center;
        align-items: center;
        img, i{
            width: 100%;
            height: 20px;
            border-radius: 50%;
        }
    }
    &__info{
        margin-right: 8px;
    }
}
</style>