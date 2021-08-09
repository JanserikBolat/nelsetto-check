<template>
<div class="clientCard">
    <div class="clientCard__inner">
        <div class="client__info">
            <div class="info__left">
                <div class="name__surname">{{client.client_name}} {{client.client_surname}}</div>
                <div class="company">{{client.company}}</div>
                <div class="call">Позвонить {{client.client_tel}}</div>
                <div class="text">Написать в WhatsApp</div>
            </div>
            <div class="info__right">
                <div class="client__photo">
                    <img :src="client.client__photo" alt="Photo" v-if="client.client__photo">
                    <i class="fas fa-user-circle"></i>
                </div>
            </div>
        </div>
        <div class="order__info">
            <p class="order__amount">Общее количество заказов:{{getOrderAmount}}</p>
            <div class="order__current">
                <p>Текущие: {{getCurrentOrders}}</p> 
                <div class="btn"><i class="fas fa-chevron-right"></i></div>
            </div>
            <div class="order__finished">
                <p>Завершеннные: {{getFinishedOrders}}</p> 
                <div class="btn"><i class="fas fa-chevron-right"></i></div>
            </div>
            <div class="order__canceled">
                <p>Отмененные: {{getCanceledOrders}}</p>
                <div class="btn"><i class="fas fa-chevron-right"></i></div> 
            </div>
        </div>
        <div class="payload__info">
            <p style="margin: 16px 0px;font-weight:500">Оплата</p>
            <div class="all__paid">
                <div class="key">Всего оплачено:</div>
                <div class="value">{{getAllPaid}} ₸</div>
            </div>
            <div class="remaining__current">
                <div class="key">Остаток по текущим заказам:</div>
                <div class="value">{{getCurrentRemainMoney}} ₸</div>
            </div>
            <div class="debt">
                <div class="key">Долги:</div>
                <div class="value">{{getDebts}} ₸</div>
            </div>
        </div>
    </div>    
</div>    
</template>
<script>
export default {
    props:['client'],
    data(){
        return{
            orders: JSON.parse(localStorage.getItem('orderInfo'))
        }
    },
    computed: {
        getAllPaid(){
            return this.getClientOrders.map(e=>e.bookings.reduce((acc, curr)=>acc+curr.paid,0)).reduce((acc, curr)=>acc+curr,0);
        },
        getClientOrders(){

            return this.orders.filter(e=>e.client.client_tel===this.client.client_tel&&e.status!=='В ожидании');
        },
        getOrderAmount(){
            return this.getClientOrders.length;
        },
        getCurrentOrders(){
            return this.getClientOrders.filter(e=>e.status==='Потверждено').length
        },
        getFinishedOrders(){
            return this.getClientOrders.filter(e=>e.status==='Завершено').length
        },
        getCanceledOrders(){
            return this.getClientOrders.filter(e=>e.status==='Отменено').length
        },
        getCurrentRemainMoney(){
            return this.getClientOrders.filter(e=>e.status!=='Отменено').map(e=>e.bookings.filter(e=>e.status==='Потверждено').reduce((acc, curr)=>acc+(curr.price-curr.booking_discount-curr.paid),0)).reduce((acc, curr)=>acc+curr,0)
        },
        getDebts(){
            return this.getClientOrders.filter(e=>e.status!=='Отменено').map(e=>e.bookings.filter(e=>e.status==='Завершено').reduce((acc, curr)=>acc+(curr.price-curr.booking_discount-curr.paid),0)).reduce((acc, curr)=>acc+curr,0)
        }
    },
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
.clientCard{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    padding: 16px;
    z-index: 16;
}
.client{
    &__info{
        display: flex;
        margin-bottom: 16px;
    }
    &__photo{
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        img, i {
            width: 100%;
            height: 100%;
            font-size: 64px;
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, 0.2);
        }
    }
}
.info{
    &__left{
        width: 75%;
    }
    &__right{
        width: 25%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
.name__surname{
    font-weight: 500;
    font-size: 20px;
    line-height: 32px;
}
.call{
    margin-top: 8px;
    margin-bottom: 4px;
}
.order{
    &__amount{
        font-weight: 500;
        margin-bottom: 16px;
    }
    &__current, &__finished, &__canceled{
        margin-bottom: 8px;
        background: rgba(0, 0, 0, 0.04);
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
.btn{
    width: 24px;
    height: 24px;
    background: #FFFFFF;
     box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.all__paid, .remaining__current, .debt{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.debt>.value{
    color: #FF4D4D;
}
</style>