<template>
<div class="register__wrapper">
  <spinner :start="start" />
    <order-header>
        <template v-slot:newUser>
                <p class= "new__order">{{is_crm?'Бронь на себя':'Новый клиент'}}</p>
                <div class="close__order" @click="goBack()">
                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                </div>
        </template>
    </order-header>
    <user-register-form  @createOrder="createOrder" :is_crm="is_crm"/>
</div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import OrderHeader from '../components/OrderHeader.vue'
import UserRegisterForm from '../components/UserRegisterForm.vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import axios from 'axios'
import Spinner from "../components/Spinner";
export default {
    props:['is_crm'],
    components: {Spinner, OrderHeader, UserRegisterForm},
    data(){
      return{
        start: false,
        url: window.location.origin.replace('playfields.', '')
      }
    },
    mounted(){
      window.scrollTo(0,0)
    },
    methods: {
      goBack(){
            this.$store.dispatch('booking/resetState')
            this.$store.dispatch('order/resetState')
            this.$router.push({path: '/' })
        },
    async createOrder(){
      this.start = true;

      const sendData = {
        phone: this.order.client.phone,
        order: {
          payment_type: this.order.payment_type,
          type: this.order.type,
          company: this.order.company
        },
        discount: this.booking.discount,
        facility_id: this.facility.id,
        bookings: this.order.booking.map(e=>{

          let a = {'playfield_id': e.playfield_id,
                'start_time': e.start_time,
                'end_time': e.end_time,
                'price': e.price,
                'date': e.date.format('YYYY-MM-DD') 
              }
              return a;
        }
        )
      }

      if(this.order.client.is_temporary){
        sendData['client'] = {
          firstname: this.order.client.firstname,
          lastname: this.order.client.lastname
        }
      }
      await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/order/make`, {...sendData}, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}}
      ).then(e=>{
        this.$store.dispatch('order/setOrder', e.data.order)
        this.$store.dispatch('order/replaceBooking', e.data.order.booking)
        this.$store.dispatch('booking/setBooking', e.data.order.booking[0])
        this.$store.dispatch('order/setClient', e.data.order.client);
        this.$router.push({path: `/order/${this.order.id}`})
        }).finally(()=>this.start = false)
    },
    durationFormat: (duration)=>{
            const hours = Math.floor(duration/60)
            const minutes = duration%60
            return dayjs().hour(hours).minute(minutes).second(0).format('HH:mm:ss')
        } 
  },
  computed: {
    ...mapGetters('order', ['getOrder', 'getClient', 'getAllDiscount', 'getAllPaid', 'getAllCost']),
    ...mapState('booking', ['booking']),
    ...mapState('order', ['order']),
    ...mapState('facility', ['facility'])
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
    //box-shadow: 0px 4px 8px rgb(0 0 0 / 4%), 0px 0px 2px rgb(0 0 0 / 6%), 0px 0px 1px rgb(0 0 0 / 4%)
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
