<template>
    <div class="main__content" :class="{'fullPay': fullPay}" @click="goToBooking()">
        <div class="content__inner">
            <div class="content_top">
                <div class="contentTop__inner">
                    <div class="content__left">
                        <div class="mini__description">
                            <b>{{info.booking.start_time}}-{{info.booking.end_time}}</b>, Площадка {{info.booking.field_id}}
                        </div>
                        <div class="info__payload">
                            <div class="payload__type">
                                {{info.pay_type==="cash"?"Наличными":"По реквизитам"}}
                            </div>
                            <div class="payload__remain">
                                Остаток:  {{getRemainMoney}}тг
                            </div>
                        </div>
                    </div>
                    <div class="content__right">
                        <div class="client__info">
                            <div class="client__photo">
                                <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F537699494%2FBartSimpson.jpg&f=1&nofb=1" alt="">
                            </div>
                            <div class="client__name">
                                {{info.client.client_name}}
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
            <div v-if='!fullPay' class="content__bottom">
                    <div class="payload__button" @click.stop="addPayload()">
                        Добавить оплату
                    </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['info'],
    computed: {
        fullPay: function(){
            return  this.getRemainMoney<=0;
        },
        getRemainMoney: function(){
            return this.info.booking.price-(this.info.booking.paid+this.info.booking.booking_discount)
        }
    },
    methods: {
        addPayload(){
            this.$emit('addPayload', this.info.orderId, this.info.booking.bookingId)
        },
        goToBooking(){
            this.$store.dispatch('order/setOrder', this.info)
            this.$store.dispatch('booking/setBooking', this.info.booking)
            this.$router.push({path:`/order/:${this.info.orderId}/booking/:${this.info.booking.bookingId}`})
        }
    }
}
</script>
<style lang="scss" scoped>
*{
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
}
.main__content{
    background: #FFFFFF;
    margin: 16px;
}
.content_top{
    padding-left: 12px;
    padding-top: 12px;
    padding-bottom: 26px;
}
.contentTop__inner{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.payload__type, .payload__remain{
    font-size: 12px;
}
.client{
    &__photo{
    display: flex;
    justify-content: center;
    align-items: center;
        img{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            }
    }
    &__info{
        margin: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    &__name{
        margin-left: 8px;
        font-weight: 700;
    }
}
.fullPay{
    background: linear-gradient(0deg, rgba(79, 244, 20, 0.15), rgba(79, 244, 20, 0.15)), #FFFFFF;
}
.payload__button{
    width: 100%;
    background: rgba(0, 0, 0, 0.04);
    border: 0.3px solid rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>