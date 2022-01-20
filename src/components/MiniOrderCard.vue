<template>
    <div class="mini__card" @click.stop="goToBookingCard()" :class="{'fullpay': getRemainMoney===0&&orderValid}">
      <div class="backdrop" v-if="showRefund||openPopup" @click.stop="showRefund = false; openPopup = false"></div>
        <div class="miniCard__inner">
            <div class="miniCard__top">
                <span class="order__date">{{capitalizeAndFormat(booking.date)}}</span>
                <span class="order__edit" v-show="orderValid&&booking.status!=='completed'" @click.stop="goToEdit()"><i class="fas fa-pen"></i></span>
            </div>
            <div class="miniCard__bottom">
                <div class="bottom__description">
                    <p>{{booking.start_time.substring(0,5)}} - {{booking.end_time.substring(0,5)}}</p>
                    <p>{{booking.playfield.pf_name}}</p>
                    <p v-show="orderValid">Остаток:  {{booking.debt}}₸</p>
                    <p v-show="booking.status==='completed'&&booking.debt" class="completed">Долг:  <span>{{booking.debt}} ₸</span></p>
                    <p v-show="booking.status==='canceled'&&booking.paid>0" class="canceled">Возврат клиенту:  <span>{{booking.paid}} ₸</span></p>
                </div>
                <div class="bottom__payment" @click.stop="setBooking()" v-if="getRemainMoney>0&&orderValid">
                    Добавить оплату
                </div>
            </div>
          <div class="refund" v-if="booking.status==='canceled'&&booking.paid>0&&!booking.inquiry" @click.stop="showRefund = true">
            Оформить возврат
          </div>
          <div class="approved" v-if="booking.status==='canceled'&&booking.inquiry">
            Ожидание подтверждения клиента
          </div>
        </div>

        <div class="refund_popup" v-if="showRefund">
          <div class="title">
            <p>Возврат средств клиенту</p>
            <img src="/img/close.svg" alt="close" @click.stop="closeRefund()">
          </div>
          <div class="client_info">
            <div class="name">Клиент: {{order.client.firstname}} {{order.client.lastname}}</div>
            <div class="phone">Номер телефона: {{order.client.phone}}</div>
            <div class="amount">Сумма: {{booking.paid}} ₸</div>
          </div>
          <div class="approve" @click.stop="approveRefund()" v-if="!booking.inquiry">
            Подтвердить возврат
          </div>
          <div class="approved" v-if="booking.inquiry">
            Ожидание подтверждения клиента
          </div>
        </div>
        <payment-popup v-if="openPopup" @addPayment="addPayment" @closePayment="closePayment" :remain="getRemainMoney" :is_crm="order.client.is_crm">
            <template v-slot:title>
                <p>Добавьте оплату</p>
            </template>
        </payment-popup>
    </div>
</template>
<script>
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import {mapState} from 'vuex'
import PaymentPopup from './PaymentPopup.vue'
import axios from "axios";
export default {
    props: ['booking', 'backdrop'],
    components: {
        PaymentPopup
    },
    data(){
        return{
            openPopup: false,
            showRefund: false,
            url: window.location.origin.replace('playfields.', '')
        }
    },
    methods: {
        capitalizeAndFormat(s){
            s = dayjs(s).locale('ru').format('dd, DD MMMM')
            return s.replace(s[0],s[0].toUpperCase())
        },
        setBooking(){
            this.openPopup = true;
            this.$store.dispatch('booking/setBooking', this.booking);
            this.$emit('backdropHandle', true);
        },
        async addPayment(money){
            this.openPopup = false;
            await this.$store.dispatch('booking/setBookingPaid', {money: money, id:this.booking.id});
            window.location.reload()
        },
        closePayment(){
            this.openPopup = false;
        },
        goToBookingCard(){
                this.setBooking();
                this.$router.push({name: 'singleBooking', params: {id: this.order.id, bookingid: this.booking.id}});
        
        },
        goToEdit(){
            this.$store.dispatch('booking/setBooking', this.booking);
            this.$router.push({path:`/order/:${this.order.id}/booking/:${this.booking.id}/edit`})
        },
        async approveRefund(){
          await  axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/reservation/${this.booking.id}/refund-inquiry`, {}, {
            headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}}).then(()=>window.location.reload()).catch(e=> {
            this.showRefund = false;
            this.hasError = true;
            this.errorMessage = e.response.data.error;
          });
        },
        closeRefund(){
          this.showRefund = false;
        }
    },
    computed: {
        ...mapState('order', ['order']),
        orderValid(){
            return this.booking.status==='activated';
        },
        getRemainMoney(){
            return this.booking.debt
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
.mini__card{
    background: #fff;
    padding: 8px 8px 16px 8px;
    margin-bottom: 8px;
}
.miniCard__top{
    display: flex;
    justify-content: space-between;
    align-self: center;
    margin-bottom: 12px;;
}
.miniCard__bottom{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.order__date{
    line-height: 24px;
    font-weight: 500;
}
.bottom__description{
    p{
        font-size: 12px;
        line-height: 14px;
    }
  .completed{
    span{
      color: #FF5252;
      font-size: 12px;
      line-height: 14px;
    }
  }
  .canceled{
    span{
      color: #E0BD03;
      font-size: 12px;
      line-height: 14px;
    }
  }
}
.bottom__payment{
    padding: 4px 24px;
    background: rgba(0, 0, 0, 0.04);
    border: 0.3px solid rgba(0, 0, 0, 0.5); 
    cursor: pointer;
}
.fullpay{
    background: linear-gradient(0deg, rgba(79, 244, 20, 0.15), rgba(79, 244, 20, 0.15)), #FFFFFF;
}
.approved{
  text-align: center;
  color: rgba(0, 0, 0, 0.54);
  margin-top: 32px;
}
.refund{
  padding:4px 0px;
  width: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.04);
  border: 0.3px solid rgba(0, 0, 0, 0.5);
  margin-top: 16px;
  &_popup{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 15;
    background: #fff;
    padding: 24px 16px;
    border-radius: 8px 8px 0px 0px;
    .title{
      display: flex;
      justify-content: space-between;
      align-content: center;
      p{
        font-weight: 500;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.15px;
      }
    }
    .client_info{
      letter-spacing: 0.25px;
      color: rgba(0, 0, 0, 0.87);
      div{
        margin-top: 16px;
      }
    }
    .approve{
      padding: 8px 0px;
      background: rgba(0, 0, 0, 0.04);
      border: 0.3px solid rgba(0, 0, 0, 0.5);
      text-align: center;
      margin-top: 36px;
    }
    .approved{
      text-align: center;
      color: rgba(0, 0, 0, 0.54);
      margin-top: 32px;
    }
  }
}
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
</style>