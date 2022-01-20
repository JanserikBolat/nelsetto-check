<template>
    <div class="orderInfo">
      <div class="backdrop" v-if="discountAdd||depositAdd||depositManage||depositRefund||hasError" @click.stop="closePayment"></div>
        <div class="orderInfo__inner">
            <div class="orderInfo__info">
                <div class="order__date flex">
                    <p class="order__type">{{order.type?"Разовая бронь":"Период бронирования"}}</p>
                    <p class="date__value">{{getDateFormat(order.start_date)}}{{order.type?'':` - ${getDateFormat(order.end_date)}`}}</p>
                </div>
                <div class="order__details flex">
                    <p class="details__key">Детали</p>
                    <div class="details__value">
                        <p>{{booking.start_time.substring(0,5)}} - {{booking.end_time.substring(0,5)}}, {{getDayFormat(order.start_date)}}</p>
                        <p>{{getDuration}}({{booking.price}} 	₸)</p>
                    </div>
                </div>
                <div class="order__field flex">
                    <p class="field__key">Площадка</p>
                    <p class="field__value">{{booking.playfield.pf_name}}</p>
                </div>
                <div class="order__cost flex">
                    <p class="cost__key">Общая сумма</p>
                    <p class="cost__value">{{order.total_price}} ₸</p>
                </div>
                <div class="order__paytype flex">
                    <p class="paytype__key">Способ оплаты</p>
                    <p class="paytype__value">{{order.payment_type==='cash'?"Наличными":"По реквизитам"}}</p>
                </div>
                <div class="order__paid flex">
                    <p class="paid__key">Оплачено</p>
                    <p class="paid__value">{{order.paid}} ₸</p>
                </div>
                <div class="order__discount">
                    <div class="flex">
                        <p class="discount__key">Скидка</p>
                        <p class="discount__value">{{order.total_discount}} ₸</p>
                    </div>
                </div>
                <div class="order__remainingPaylaod flex" v-show="order.status!=='completed'">
                    <p class="remainingPayload__key">Остаток</p>
                    <p class="remaininPayload__value">{{order.residue}} ₸</p>
                </div>
            </div>
            <div class="order__deposit" v-if="!order.type">
                <div class="flex">
                    <p class="deposit__key">Залог</p>
                    <p class="deposit__value">{{`${order.deposit}`}} ₸</p>
                </div>
            </div>
          <div class="order__remainingPaylaod flex" v-show="order.debt>0">
            <p class="remainingPayload__key bold">Долг</p>
            <p class="remaininPayload__value red">{{order.debt}} ₸</p>
          </div>
          <div class = "deposit__button" @click="depositManage=true" v-if="!order.type">Управление залогом</div>
            <div class="deposit_management" v-if="depositManage">
              <div class="title">
                <p>Управление залогом</p>
                <img src="/img/close.svg" alt="close" @click.stop="depositManage = false">
              </div>
              <div class="manage">
                <div class="add_deposit">
                  <p class="deposit_amount">Сумма залога: {{order.deposit}} ₸</p>
                  <div class="btn" @click.stop="depositManage = false; depositAdd = true;">Добавить залог</div>
                </div>
                <div class="subtract_deposit" v-if="order.debt">
                  <p class="debt_amount">Долг: <span>{{order.debt}} ₸</span></p>
                  <div class="btn" @click.stop = "substractDeposit()" :class="{'unabled': order.deposit<=0}">Списать залог</div>
                </div>
              </div>
              <div class="return_deposit" @click.stop="depositManage = false; depositRefund = true">Вернуть залог</div>
            </div>

            <payment-popup v-show="depositAdd"  :remain="getRemainMoney" @addPayment="addPayment" @closePayment="closePayment" :is_crm="order.client.is_crm">
                <template v-slot:title>
                    <p>Добавьте залог</p>
                </template>
            </payment-popup>

          <div class="approve_deposit" v-if="depositRefund">
            <div class="title">
              <p>Возврат залога</p>
              <img src="/img/close.svg" alt="close" @click.stop="depositRefund = false">
            </div>
            <div class="client_info">
              <div class="name">Клиент: {{order.client.firstname}} {{order.client.lastname}}</div>
              <div class="phone">Номер телефона: {{order.client.phone}}</div>
              <div class="amount">Сумма: {{order.deposit}} ₸</div>
            </div>
            <div class="approve" @click.stop="approveRefund()" v-if="!order.inquiry">
              Подтвердить возврат
            </div>
            <div class="approved" v-if="order.inquiry">
              Ожидание подтверждения клиента
            </div>
          </div>
        </div>

      <error-card :message = "errorMessage" @close="closePayment" v-if="hasError"/>
    </div>
</template>
<script>
import {mapState, mapGetters} from 'vuex'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import PaymentPopup from './PaymentPopup.vue'
import axios from 'axios';
import ErrorCard from "./ErrorCard";
export default {
  components: { ErrorCard, PaymentPopup },
    props: ['buttonNeeded'],
    data(){
        return{
            discountAdd: false,
            depositAdd: false,
            depositManage: false,
            depositRefund: false,
            hasError: false,
            errorMessage: '',
            url: window.location.origin.replace('playfields.', '')
        }
    },
    methods: {
        addPayment(money){
            if(this.discountAdd){
                this.$store.dispatch('order/setBookingDiscount', money);
                this.$store.dispatch('booking/setBookingDiscount', money, this.booking.id);
            }
            else if(this.depositAdd){
                axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/order/${this.order.id}/payment`, {deposit: money}, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}}
            ).then(()=>window.location.reload());
            }
            this.discountAdd = false;
            this.depositAdd = false;
        },
        closePayment(){
            this.discountAdd = false;
            this.depositAdd = false;
            this.depositManage = false;
            this.depositRefund = false;
            this.hasError = false;
        },
        addDeposit(){
            this.depositAdd = true;
        },
        getDateFormat(date){
            return dayjs(date).locale('ru').format('DD MMMM');
        },
        getDayFormat(date){
            return dayjs(date).locale('ru').format('dddd');
        },
        async substractDeposit(){
          await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/order/${this.order.id}/deposit-nullify`, {}, {
            headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}}).then(()=>window.location.reload()).catch(e=> {
            this.depositManage = false;
            this.hasError = true;
            this.errorMessage = e.response.data.error;
          })

        },
        async approveRefund(){
          await  axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/order/${this.order.id}/refund-inquiry`, {}, {
            headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}}).then(()=>window.location.reload()).catch(e=> {
            this.depositRefund = false;
            this.hasError = true;
            this.errorMessage = e.response.data.error;
          });
        }
    }, 
    computed:{
        ...mapState('booking', ['booking']),
        ...mapState('order', ['order']),
        ...mapGetters('order', ['getRemainMoney', 'getAllDiscount', 'getAllCost']),
        ...mapGetters('booking', ['getDuration', 'getPlayfieldName'])
    }
}
</script>
<style lang="scss" scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.87);
}
.orderInfo{
    background: #fff;
    padding: 16px 15px;
    margin-top: 16px;      
}
.flex{
    display: flex;
    margin-bottom: 12px;
}
.flex>*{
    width: 50%;
}
.discount__button, .deposit__button{
    width: 100%;
    height: 28px;
    background: rgba(0, 0, 0, 0.04);
    border: 0.3px solid rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center; 
    align-items: center;
}
.bold{
  font-weight: 500;
}
.red{
  color: #FF5252;
}
.deposit_management{
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 15;
  background: #fff;
  border-radius: 8px 8px 0px 0px;
  .title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    p{
      font-weight: 500;
      font-size: 20px;
      line-height: 32px;
      color: rgba(0, 0, 0, 0.87);
    }
    margin-bottom: 24px;
  }
  .manage{
    .add_deposit, .subtract_deposit{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      .debt_amount{
        span{
          color: #FF5252;
        }
      }
      .btn{
        background: rgba(0, 0, 0, 0.04);
        border: 0.3px solid rgba(0, 0, 0, 0.5);
        padding: 6px 0px;
        width: 168px;
        text-align: center;
      }
      .unabled{
        pointer-events: none;
        background: rgba(0, 0, 0, 0.04);
        opacity: 0.5;
        border: 0.3px solid rgba(0, 0, 0, 0.5);
        color: rgba(0, 0, 0, 0.38);
      }
    }
  }
  .return_deposit{
    text-align: center;
    background: #000;
    color: #fff;
    padding: 6px 0px;
  }
}
.approve_deposit{
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 15;
  background: #fff;
  border-radius: 8px 8px 0px 0px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      font-weight: 500;
      font-size: 20px;
      line-height: 32px;
      color: rgba(0, 0, 0, 0.87);
    }

    margin-bottom: 24px;
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