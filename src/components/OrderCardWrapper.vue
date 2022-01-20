<template>
    <div class="orderCard__wrapper">
        <OrderCard v-for="order, index in filteredOrders" :order="order" :key="index"/>
    </div>
</template>
<script>
import OrderCard from './OrderCard.vue'
export default {
    props: ['status', 'filteredOrders'],
    components: {OrderCard},
}
</script>
<style lang="scss" scoped>
.orderCard__wrapper{
    margin-bottom: 49px;
}

</style>