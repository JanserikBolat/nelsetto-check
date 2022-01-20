<template>
    <div class="bottom__menu">
        <div class="menu__option calendar"  @click="makeActive('calendar')">
            <i class="far fa-calendar" :class="activeTab==='calendar'?'active':''"></i>
            <p :class="activeTab==='calendar'?'active':''">Календарь</p>
        </div>
        <div class="menu__option orders"  @click="makeActive('orders')">
            <i class="fas fa-plus-circle" :class="activeTab==='orders'?'active':''">
                <div class="circle" v-if="waiting">{{waiting}}</div>
            </i>
            <p :class="activeTab==='orders'?'active':''">Заказы</p>
        </div>
        <div class="menu__option clients" @click="makeActive('clients')">
            <i class="fas fa-user" :class="activeTab==='clients'?'active':''"></i>
            <p :class="activeTab==='clients'?'active':''">Клиенты</p>
        </div>
        <div class="menu__option menu" @click="makeActive('menu')">
            <i class="fas fa-bars" :class="activeTab==='menu'?'active':''"></i>
            <p :class="activeTab==='menu'?'active':''">Меню</p>
        </div>
    </div>    
</template>
<script>
import {mapState} from 'vuex'
import axios from 'axios'
export default {
    props: ['active'],
    data(){
        return{
            activeTab: this.active,
            waiting: '',
            url: window.location.origin.replace('playfields.', '')
        }
    },
    async mounted(){
        await this.getWaitingAmount();
    },
    watch:{
        'facility.id': async function(){
            await this.getWaitingAmount();
        }
    },
    methods: {
        makeActive(tab){
            this.activeTab = tab;
            switch(this.activeTab){
                case 'calendar':
                    this.$router.push({path: '/'})
                    break;
                case 'orders':
                    this.$router.push({path: '/orders'})
                    break;
                case 'clients':
                    this.$router.push({path: '/clients'})
                    break;
                case 'menu':
                    this.$router.push({path: '/auth'})
                    break;
            }
        },
        async getWaitingAmount(){
            this.waiting = await axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${this.facility.id}/pending`,
            {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(res=>res.data.orders);
            }
        },
        computed: {
            ...mapState('facility', ['facility']),
        }
    }
</script>
<style lang="scss" scoped>
.bottom__menu{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    position:fixed;
    z-index: 30;
    bottom: 0;
    width: 100%;
    height: 49px;
    background: #fff;
}
.menu__option{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    width: 25%;
    p{
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 10px;
        line-height: 12px;
        text-align: center;
        letter-spacing: 0.4px;
        color: rgba(0, 0, 0, 0.38);
    }
    i{
        color: rgba(0, 0, 0, 0.38);
        position: relative;
    }
    .active{
           color: #000;
        }
}
    .circle{
        position: absolute;
        right: -50%;
        top: 0;
        background: yellow;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 10px;
        line-height: 14px;
        color: #000;
    }
</style>