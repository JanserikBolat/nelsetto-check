<template>
    <div class="confirmation__card">
        <div class="confirmation__inner">
            <div v-if="!fromNelsette" class="ordinary__user">
                <p style="font-weight: 500; margin-bottom: 16px">Потверждение заказа</p>
                <p class="confirmation__text" style="margin-bottom: 16px">
                    На номер телефон клиента был отправлен код, для подтверждения заказа попросите назвать его вас.
                </p>
                <div class="confirmation__code">
                    <input maxlength="1" type="text"  @keyup="handleClick('','one', 'two')" inputmode="tel" ref="one" >
                    <input maxlength="1" type="text"  @keyup="handleClick('one', 'two', 'three')" inputmode="tel" ref="two" >
                    <input maxlength="1" type="text"  @keyup="handleClick('two','three', 'four')" inputmode="tel" ref="three">
                    <input maxlength="1" type="text"  @keyup="handleClick('three', 'four', '')" inputmode="tel" ref="four" >
                </div>
                <div class="sendConfirmation" @click="sendOrder()">
                    Отправить
                </div>
            </div>
            <div  v-else-if="fromNelsette" class="nelsette__user">
                <p style="margin-bottom: 16px">Ожидание потверждения заказа</p>
                <p>{{user.client_name}} {{user.client_surname}} должен потвердить заказ зайдя в приложение</p>
            </div>
        </div>
    </div>    
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    props: ['fromNelsette', 'user'],
    data(){
        return{
            orders: JSON.parse(localStorage.getItem('orderInfo'))
        }
    },
    mounted(){
        this.$refs['one'].focus();
    },
    methods: {
        handleClick(prev, itself, next){
            if(this.$refs[itself].value.length){
                if(next!=''){
                    this.$refs[next].focus();
                }
            }
            else{
                if(prev!=''){
                    this.$refs[prev].focus()
                }
            }
        },
        sendOrder(){
            this.$store.dispatch('order/setStatus', 'Потверждено')
            this.$emit('updateLocalStorage', this.getOrder)
        }
    },
    computed: {
        ...mapGetters('order', ['getOrder'])
    }
}
</script>
<style lang="scss" scoped>
*{
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    outline: none;
    border: none;
}
.confirmation__card{
    padding: 8px 16px;
    background: #FDFF97;
    margin: 16px 0px;
}
.confirmation__code{
    display: flex;
    input{
        width: 34px;
        height: 40px;
        background: #BEBEBE;
        margin-right: 36px;
        font-size: 24px;
        text-align: center;
    }
}
.sendConfirmation{
    padding: 5px 7px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background: #000;
    margin-top: 16px;
    width: 85px;
}
</style>