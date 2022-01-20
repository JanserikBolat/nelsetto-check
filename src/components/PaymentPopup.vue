<template>
    <div class="payment__popup" :class="{'bottom': hasMenu}">
        <div class="payment__inner">
            <div class="payment__top">
                <slot name="title"></slot>
                <div class="close" @click.stop="closePayment">
                    <i class="fas fa-times"></i>
                </div>
            </div>
            <div class="payment__input">
                <input type="text" ref="payment" inputmode="tel" v-model="money" @keypress.stop="isNumber($event)" @keyup.stop="isMore()" :class="{'notValid':!isValid&&!is_crm}">
                <p v-if="!isValid&&!is_crm" class="error">Сумма оплаты/скидки/залога не может превышать остаток</p>
            </div>
            <div class="addPayment" @click.stop="addPayment" :class="{'disableBtn':!isValid&&!is_crm}">
                Добавить
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['remain', 'hasMenu', 'is_crm'],
    data(){
        return{
            money: '',
            isValid: true
        }
    },
    mounted(){
        this.$refs['payment'].focus();
    },
    methods: {
        closePayment(){
            this.$emit('closePayment');
            this.money = '';
        },
        addPayment(){
            this.isValid&&this.$emit('addPayment', parseInt(this.money))
            this.money = '';
        },
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)){
                evt.preventDefault();
            }
            else {
                return true;
            }
    },
    isMore: function(){
        this.isValid = !(parseInt(this.money) > this.remain && this.money.length)
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
            height: 36px;
            padding: 4px 4px;
            border: 1px solid black;
        }

    }
}
.notValid{
    border: 1px solid red;
}
.error{
    color: red;
    font-size: 12px;
}
.addPayment{
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000;
    color: #fff;
    margin-top: 16px;
    padding: 6px 0px;
}
.disableBtn{
    background: #9D9D9D;
    pointer-events: none;
}
.bottom{
    bottom: 49px;
}
</style>