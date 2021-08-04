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
            today: dayjs().format('DD-MM-YYY'),
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
                    this.filteredOrders = this.getArchive
                    break
            }
            console.log(this.filteredOrders)
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
            return this.orders.filter(e=>dayjs(e.date).diff(dayjs(this.today), 'day')<0)
        }
    }
}
</script>