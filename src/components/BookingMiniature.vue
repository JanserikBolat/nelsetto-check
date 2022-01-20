<template>
    <div class="main__content"  @click="goToBooking()" :class="{'completedCard': info.status==='completed'}">
      <div class="backdrop" v-if="openPopup" @click.stop="openPopup = false"></div>
        <div class="content__inner">
            <div class="content_top">
                <div class="contentTop__inner">
                    <div class="content__left">
                        <div class="mini__description">
                            <p :class="{'completed': info.status==='completed'}" v-if="info.status==='completed'">Завершенная бронь</p>
                            <b>{{info.start_time.substring(0,5)}}-{{info.end_time.substring(0,5)}}</b>, {{info.playfield.name}}
                        </div>
                        <div class="info__payload">
                            <div class="payload__type">
                                {{info.order.payment_type==="cash"?"Наличными":"По реквизитам"}}
                            </div>
                            <div class="payload__remain" :class="{'fullPay': fullPay}">
                                {{fullPay?'Оплачено': `Остаток: ${info.debt} тг`}}
                            </div>
                        </div>
                    </div>
                    <div class="content__right">
                        <ClientCardMini :client="info.client" :hasMenu="true" :company="info.order.company"/>
                    </div>
                </div>
            </div>
            <div v-if='!fullPay' class="content__bottom">
                    <div class="payload__button" @click.stop="openPopup=true">
                        Добавить оплату
                    </div>
            </div>
            <div class="payment">
                <payment-popup v-if="openPopup" @addPayment="addPayload" @closePayment="openPopup = false" :remain="info.debt" :hasMenu="true" :is_crm="info.client.is_crm">
                <template v-slot:title>
                    <p>Добавьте оплату</p>
                </template>    
            </payment-popup> 
            </div>
        </div>
    </div>
</template>
<script>
import ClientCardMini from './ClientCardMini.vue'
import PaymentPopup from './PaymentPopup.vue'
export default {
    data(){
        return{
            openPopup:false
        }
    },
    props: ['info'],
    components: {
        ClientCardMini, PaymentPopup
    },
    computed: {
        fullPay: function(){
            return  this.info.debt<=0;
        },
        getRemainMoney: function(){
            return this.info.price-(this.info.paid+this.info.booking_discount)
        }
    },
    methods: {
        async addPayload(money){
            await this.$store.dispatch('booking/setBookingPaid', {money: money, id:this.info.id});
            this.openPopup = false;
            window.location.reload()
        },
        goToBooking(){
            this.$store.dispatch('booking/setBooking', this.info)
            this.$router.push({name: 'singleBooking', params: {id: this.info.order_id, bookingid: this.info.id}});
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
.completedCard{
    background: #EDEDED;
    border: 1px solid #D1D1D1;
}
.content_top{
    padding-left: 12px;
    padding-top: 12px;
    padding-bottom: 26px;
}
.completed{
    font-style: italic;
    font-size: 12px;
    line-height: 14px;
    color: rgba(0, 0, 0, 0.54);
    margin-bottom: 8px;
}
.info__payload{
    margin-top: 8px;
}
.contentTop__inner{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.fullPay{
    font-weight: 500;
}
.payload__type, .payload__remain{
    font-size: 12px;
    line-height: 14px;
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
.payload__button{
    width: 100%;
    background: #03A9F4;
    color: #fff;
    height: 36px;
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