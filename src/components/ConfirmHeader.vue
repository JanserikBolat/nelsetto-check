<template>
    <div class="confirm__header">
        <div class="confirmHeader__inner">
            <div class="confirmHeader__left">
                <div class="backToOrders">
                    <div class="back__button" @click.stop="resetStore()">
                        <i class="fas fa-chevron-left"></i>
                    </div>
                </div>
                <div class="orderDescription">
                    <slot name="main"></slot>
                    <slot name="status"></slot>
                    <slot name="date"></slot>
                    <slot name="title"></slot>
                </div>
            </div>
            <div class="userInformation">
                <client-card-mini :client="order.client" :company="order.company"/>
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
    },
    methods: {
        resetStore(){
            this.$store.dispatch('order/resetState')
            this.$store.dispatch('booking/resetState')
            this.$emit('back');        
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
    align-items: center;
}
.confirmHeader__left{
    display: flex;
}
.orderDescription{
    margin-left: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .order__id, .field__time{
        font-weight: 500;
        font-size: 20px;
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
</style>