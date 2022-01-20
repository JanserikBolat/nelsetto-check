<template>
    <div class="order__view">
        <Spinner :start="start"/>
        <MainHeader @changed="changed">
            <template v-slot:title>
                <p class="title">Заказы</p>
            </template>
        </MainHeader>
        <div class="orderView__header">
            <div class="header__inner">
                <div class="order__status">
                    <div class="order__waiting" :class="active==='pending'?'active':''" @click="makeActive('pending')" v-if="getWaiting.length">
                        <p>В ожидании</p>
                        <p class="amount">{{getWaiting.length}}</p>
                    </div>
                    <div class="order__confirmed" :class="active==='activated'?'active':''" @click="makeActive('activated')">
                        <p>Активные</p>
                        <p class="amount">{{getConfirmed.length}}</p>
                    </div>
                    <div class="order__archive" :class="active==='archive'?'active':''" @click="makeActive('archive')">
                        <p>Архив</p>
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
import MainHeader from '../components/MainHeader.vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import axios from 'axios';
import { mapState } from 'vuex'
import Spinner from '../components/Spinner.vue'
export default {
    components: {BottomMenu, OrderCardWrapper,MainHeader, Spinner},
    data(){
        return{
            active: "pending",
            orders: [],
            filteredOrders: [],
            today: dayjs().locale('ru'),
            start: true,
            url: window.location.origin.replace('playfields.', '')
        }
    }, 
    watch: {
        'facility.id': async function(){
            window.scrollTo(0,0)
            await this.getOrders();
            if(this.getWaiting.length>0){
                this.filteredOrders = this.getWaiting
                this.active = "pending";
            }
            else{
                this.filteredOrders = this.getConfirmed;
                this.active = "activated";
            }
            this.$nextTick(()=>this.start = false);   
        }
    },
    async created(){
        window.scrollTo(0,0)
        await this.getOrders();
        if(this.getWaiting.length>0){
            this.filteredOrders = this.getWaiting
            this.active = "pending";
        }
        else{
            this.filteredOrders = this.getConfirmed;
            this.active = "activated";
        }
        this.$nextTick(()=>this.start = false);
    },
    methods: {
        async getOrders(){
            await axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${sessionStorage.getItem('active_facility')}/orders-all`, {
            headers: {
                    'Authorization': `Bearer ${window.$cookies.get('access_token')}`
                }
        }).then(res=>{
            this.orders = res.data.orders;
        }); 
        },
        makeActive(status){
            this.active = status;
            switch(this.active){
                case "activated":
                    this.filteredOrders = this.getConfirmed;
                    break;
                case "pending":
                    this.filteredOrders = this.getWaiting;
                    break;
                case "archive":
                    this.filteredOrders = this.getArchive;
                    break;
            }
        },
        changed(id){
            this.start = true;
            this.$store.dispatch('facility/resetFacility', parseInt(id)).then(()=>this.start = false);
            sessionStorage.setItem('active_facility', parseInt(id))
        }
    },
    computed:{
        ...mapState('facility', ['facility']), 
        getConfirmed(){
            return this.orders.filter(e=>e.status==='activated')
        },
        getWaiting(){
            return this.orders.filter(e=>e.status==='pending')
        },
        getArchive(){
            return this.orders.filter(e=>e.status==='canceled'||e.status==='completed'||e.status==='rejected')
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
    background: #E5E5E5;
    margin-top: 98px;
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
        margin-top: 16px;
    }
    &__confirmed, &__waiting, &__archive{
        padding: 5px 7px;
        flex: 1 1 0;
        display: flex;
        align-items: center;
        margin-left: 1px;
        background: #fff;
        .amount{
            width: 24px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 8px;
        }
    }
    &__waiting{
        .amount{
            background: #FBE83C;
            border-radius: 50%;
        }
    }
    }
}
.active{
    background: #A9A9A9!important;
}

</style>