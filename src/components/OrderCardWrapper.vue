<template>
    <div class="orderCard__wrapper">
        <OrderCard v-for="order, index in filteredOrders" :order="order" :key="index"/>
    </div>
</template>
<script>
import OrderCard from './OrderCard.vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    props: ['status'],
    data(){
        return{
            today: dayjs().locale('ru'),
            filteredOrders: [],
            orders: JSON.parse(localStorage.getItem('orderInfo'))
        }
    },
    mounted(){
        this.filteredOrders = this.getWaiting;
    },
    components: {OrderCard},
    watch: {
        status: function(){
            switch(this.status){
                case 'Активные':
                    this.filteredOrders = this.getConfirmed
                    break
                case 'В ожидании':
                    this.filteredOrders = this.getWaiting
                    break
                case 'Архив':
                    console.log(this.getArchive)
                    this.filteredOrders = this.getArchive
                    break
            }
        }
    },
    computed: {
        getConfirmed(){
            return this.orders.filter(e=>e.status==='Потверждено')
        },
        getWaiting(){
            return this.orders.filter(e=>e.status==='В ожидании')
        },
        getArchive(){
            return this.orders.filter(e=>e.bookings.filter(el=>{
                return dayjs(el.date).diff(this.today, 'day', true)<=1}).length>0)
        }
    }
}
</script>