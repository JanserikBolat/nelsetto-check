<template>
    <div class="bottom__menu">
        <div class="menu__option calendar"  @click="makeActive('calendar')">
            <i class="far fa-calendar" :class="activeTab==='calendar'?'active':''"></i>
            <p>Календарь</p>
        </div>
        <div class="menu__option orders"  @click="makeActive('orders')">
            <i class="fas fa-plus-circle" :class="activeTab==='orders'?'active':''"></i>
            <p>Заказы</p>
        </div>
        <div class="menu__option clients" @click="makeActive('clients')">
            <i class="fas fa-user" :class="activeTab==='clients'?'active':''"></i>
            <p>Клиенты</p>
        </div>
        <div class="menu__option menu" @click="makeActive('menu')">
            <i class="fas fa-bars" :class="activeTab==='menu'?'active':''"></i>
            <p>Меню</p>
        </div>
    </div>    
</template>
<script>
export default {
    props: ['active'],
    data(){
        return{
            activeTab: this.active
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
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.bottom__menu{
    display: flex;
    position:fixed;
    bottom: 0;
    width: 100%;
    height: 49px;
    background: #fff;
}
.menu__option{
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
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
    }
    .active{
           color: #000;
        }
}
</style>