<template>
    <div class="order__wrapper">
        <order-header>
            <template v-slot:orderHeader>
                <p class= "new__order">Новый заказ</p>
                <div class="close__order" @click="goBack()">
                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                </div>
            </template>
            <template v-slot:headerBottom>
                <div class="header__bottom">
                    <p>Добавление клиента</p>
                </div>
            </template>
        </order-header> 
        <order-info @getDiscount="getDiscount" :buttonNeeded="true"/>
        <div class="search__input">
                    <label  class="phone__label" for="phone">Номер телефона</label><br>
                    <div class="search__wrapper">
                        <p class="tel__code">+7</p>
                        <input v-model="search" type="tel" id = "phone" name="phone"  title="Ваш телефонный номер"
                        maxlength="10"
                        :class="$v.search.$error?'invalid':''"
                        >
                    </div>
        </div>
        <button @click="searchNumber()">Продолжить</button>
    </div>
</template>
<script>
import OrderInfo from '../components/OrderInfo.vue'
import OrderHeader from '../components/OrderHeader.vue'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
    components: { OrderInfo, OrderHeader},
    data(){
        return{
            search: '',
            discount: 0
        }
    },
    validations:{
        search: {
          required,
          minLength: minLength(10),
          maxLength: maxLength(10)
        }
    },
    methods: {
        searchNumber(){
            if(this.$v.$invalid){
                this.$v.$touch()
                return
            }
            else{
                    this.$router.push({name: 'registerUser', params: {tel: this.search}})
            }
        },
        getDiscount(d){
            this.discount = parseInt(d);
        },
        goBack(){
            this.$store.dispatch('booking/resetState')
            this.$store.dispatch('order/resetState')
            this.$router.push({path: '/' })
        }

    }
}
</script>
<style lang="scss" scoped>
$font-stack: 'Roboto', sans-serif;
    .order__wrapper{
        height: 100vh;
        background: #E5E5E5;
    }
    label{
        font-family: $font-stack;
        font-size: 14px;
        }
    .search__wrapper{
        position: relative;
        height: 25px;
        p{
            position: absolute;
            height: 100%;
            left: 2px;
            width: 20px;
            font-family: $font-stack;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        input {
            border-top-style: hidden;
            border-right-style: hidden;
            border-left-style: hidden;
            border-bottom-style: groove;
            border-color: #E5E5E5;
            width: 100%;
            padding-left: 20px;
            font-family: $font-stack;
            font-size: 14px;
            height: 25px;
        }
    }
</style>