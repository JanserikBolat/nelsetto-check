<template>
<div class="register__wrapper">
    <order-header>
        <template v-slot:newUser>
                <p class= "new__order">Новый клиент</p>
                <div class="close__order" @click="goBack()">
                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                </div>
        </template>
    </order-header>
    <user-register-form :tel="tel" @createOrder="createOrder"/>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import OrderHeader from '../components/OrderHeader.vue'
import UserRegisterForm from '../components/UserRegisterForm.vue'
export default {
    props: ['tel'],
    components: {OrderHeader, UserRegisterForm},
    data(){
      return{
        orders: JSON.parse(localStorage.getItem('orderInfo')),
        users: JSON.parse(localStorage.getItem('users'))
      }
    },
    methods: {
      goBack(){
          this.$router.push({path:'/'})
        
      },
    createOrder(userExists){
      localStorage.setItem('orderInfo', JSON.stringify([...this.orders, this.getOrder]))
      if(!userExists){this.addUser();}
      this.$router.push({name: 'confirmation'})
    },
    addUser(){
      this.users = [...this.users, this.getClient]
      console.log(this.getClient)
      console.log(this.users)
      localStorage.setItem('users',JSON.stringify(this.users))
    } 
  },
  computed: {
    ...mapGetters('order', ['getOrder', 'getClient'])
  }
}
</script>
<style lang="sass" scoped>
$font-stack: 14px 'Roboto', sans-serif 
p
  font: $font-stack
  line-height: 20px
.registration__from
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    box-shadow: 0px 4px 8px rgb(0 0 0 / 4%), 0px 0px 2px rgb(0 0 0 / 6%), 0px 0px 1px rgb(0 0 0 / 4%)
    .form
        height: 294px
        .telephone__input
          position: relative
          padding-left: 20px
          height: 25px
        label
            font: $font-stack
            line-height: 20px
            margin-bottom: 4px
        .firstName, .telephone__number
            padding-bottom: 24px
        .lastName
            padding-bottom: 29px
.tel__code
  position: absolute
  height: 100%
  left: 2px
  width: 20px
  font: $font-stack
  display: flex
  align-items: center
  justify-content: center
input 
  border-top-style: hidden
  border-right-style: hidden
  border-left-style: hidden
  border-bottom-style: groove
  border-color: #E5E5E5
  width: 100%
  height: 100%
  font-family: $font-stack
  font-size: 14px
.invalid
  border-color: red

</style>
