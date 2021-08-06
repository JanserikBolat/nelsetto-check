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
                    this.filteredOrders = this.getArchive
                    console.log(this.filteredOrders)
                    this.filteredOrders.forEach(element => {
                        if(element.status!=='Отменено'&&element.status!=='Завершено'){
                            element.status = 'Завершено';
                        }
                    });
                    this.filteredOrders.forEach(e=>this.updateLocalStorage(e));
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
                console.log(dayjs(el.date).diff(this.today, 'day', true), el.date)
                return dayjs(el.date).diff(this.today, 'day', true)<0||e.status==='Отменено'||e.status==='Завершено'}).length>0)
        }
    },
    methods:{
         updateLocalStorage(order){
            let oId = order.orderId;
            for(let i=0;i<this.orders.length;i++){
                if(this.orders[i].orderId===oId){
                    this.orders[i] = order;
                }
            }
            localStorage.setItem('orderInfo', JSON.stringify(this.orders));
        }
    }
}
</script>