<template>
    <div class="confirm__header">
        <div class="confirmHeader__inner">
            <div class="confirmHeader__left">
                <div class="backToOrders">
                    <div class="back__button" @click="resetStore()">
                        <i class="fas fa-chevron-left"></i>
                    </div>
                </div>
                <div class="orderDescription">
                    <slot name="main"></slot>
                    <slot name="status"></slot>
                    <slot name="date"></slot>
                </div>
            </div>
            <div class="userInformation">
                    <client-card-mini :order="order"/>
            </div>
        </div>
    </div>    
</template>
<script>
import {mapState} from 'vuex'
import ClientCardMini from './ClientCardMini.vue';
export default {
  components: { ClientCardMini },
    computed: {
        ...mapState('order', ['order']),
        getOrderId: function(){
            if(this.order.orderId.length>5){
                return this.order.orderId.substring(0,5)+'...';
            }
            return this.order.orderId
        }
    },
    methods: {
        resetStore(){
            this.$store.dispatch('order/resetState')
            this.$store.dispatch('booking/resetState')
            this.$router.push({path:'/orders'})
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
.confirm__header{
    height: 62px;
    background: #fff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04);
    padding-left: 8px;
    padding-top: 5px;
    margin-bottom: 16px;
}
.confirmHeader__inner{
    display: flex;
    justify-content: space-between;
}
.confirmHeader__left{
    display: flex;
}
.orderDescription{
    margin-left: 16px;
    .order{
        &__id{
            font-weight: 500;
            font-size: 20px;
            word-break: break-all;
        }
    }
}
.back__button{
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04);
}
.userInformation{
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.04)
}
.user{
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