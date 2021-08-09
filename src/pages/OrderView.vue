<template>
    <div class="order__view">
        <div class="orderView__header">
            <div class="header__inner">
                <div class="header__title">
                    <p class="order__title">Заказы</p>
                </div>
                <div class="order__status">
                    <div class="order__waiting" :class="active==='В ожидании'?'active':''" @click="makeActive('В ожидании')">
                        <p>В ожидании</p>
                        <p class="amount">{{getWaiting.length}}</p>
                    </div>
                    <div class="order__confirmed" :class="active==='Активные'?'active':''" @click="makeActive('Активные')">
                        <p>Активные</p>
                        <p class="amount">{{getConfirmed.length}}</p>
                    </div>
                    <div class="order__archive" :class="active==='Архив'?'active':''" @click="makeActive('Архив')">
                        <p>Архив</p>
                        <p class="amount">{{getArchive.length}}</p>
                    </div>
                </div>
            </div>
        </div>
        <OrderCardWrapper :status="active" :filteredOrders="filteredOrders"/>
        <BottomMenu active="orders" />
    </div>
</template>
<script>
import BottomMenu from '../components/BottomMenu.vue'
import OrderCardWrapper from '../components/OrderCardWrapper.vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    components: {BottomMenu, OrderCardWrapper},
    data(){
        return{
            active: "В ожидании",
            orders: JSON.parse(localStorage.getItem('orderInfo')),
            filteredOrders: []
        }
    }, 
    created(){
        this.orders.forEach(el=>el.bookings.forEach(el=> {
           if(dayjs(el.date).diff(this.today, 'day', true)<0)
                el.status = 'Завершено';
           }
        ));
        this.orders.forEach(el=>{
            if(dayjs(el.end_date).diff(this.today, 'day', true)<0){
                el.status = 'Завершено';
           }
        })
        this.orders.forEach(e=>this.updateLocalStorage(e));
        this.filteredOrders = this.getWaiting;
    },
    methods: {
        updateLocalStorage(order){
            let oId = order.orderId;
            for(let i=0;i<this.orders.length;i++){
                if(this.orders[i].orderId===oId){
                    this.orders[i] = order;
                }
            }
            localStorage.setItem('orderInfo', JSON.stringify(this.orders));
        },
        makeActive(status){
            this.active = status;
            switch(this.active){
                case "Активные":
                    this.filteredOrders = this.getConfirmed;
                    break;
                case "В ожидании":
                    this.filteredOrders = this.getWaiting;
                    break;
                case "Архив":
                    this.filteredOrders = this.getArchive;
                    break;
            }
        }
    },
    computed:{
        getConfirmed(){
            return this.orders.filter(e=>e.status==='Потверждено')
        },
        getWaiting(){
            return this.orders.filter(e=>e.status==='В ожидании')
        },
        getArchive(){
            return this.orders.filter(e=>e.status==='Отменено'||e.status==='Завершено');
        }
    }
}
</script>
<style lang="scss" scoped>
p{
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 32px;
}
.order__view{
    min-height: 100vh;
    background: #E5E5E5;
}
.orderView__header{
    margin-bottom: 16px;
    .header__title{
        display: flex;
        align-items: center;
        height: 62px;
        background: #FFFFFF;
        padding-left: 8px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .order{
    &__title{
        font-weight: 500;
        font-size: 20px;
        margin-left: 12px;
    }
    &__status{
        display: flex;
        width: 100%;
        height: 30px;
        flex-flow: row;
        margin-top: 8px;
    }
    &__confirmed, &__waiting, &__archive{
        padding: 5px 7px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 33.3%;
        margin-left: 1px;
        background: #fff;
        .amount{
            width: 24px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0.04);
            margin-left: 8px;
        }
    }
    }
}
.active{
    background: #A9A9A9!important;
    .amount{
        background: #FBE83C!important;
    }
}

</style>