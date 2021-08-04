<template>
    <div class="payment__popup">
        <div class="payment__inner">
            <div class="payment__top">
                <p>Добавить оплату</p>
                <div class="close" @click="closePayment">
                    <i class="fas fa-times"></i>
                </div>
            </div>
            <div class="payment__input">
                <input type="text" ref="payment" inputmode="tel" v-model="money">
            </div>
            <div class="addPayment" @click="addPayment">
                Добавить
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            money: ''
        }
    },
    mounted(){
        this.$refs['payment'].focus();
    },
    methods: {
        closePayment(){
            this.$emit('closePayment');
        },
        addPayment(){
            this.$emit('addPayment', parseInt(this.money))
        }
    }
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
.payment{
    &__popup{
        z-index: 20;
        padding: 16px;
        background: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
    }
    &__top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
    &__input{
        input{
            width: 100%;
        }

    }
}
.addPayment{
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000;
    color: #fff;
    margin-top: 16px;
}
</style>