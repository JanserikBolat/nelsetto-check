<template>
  <div class="order_history">
      <div class="initiator" v-if="log.initiator">
        <div class="initiator_img">
          <img :src='`${url}/${photo}`' alt="photo"/>
        </div>
      </div>
      <div class="log">
        <div class="date">{{dateFormat}}</div>
        <div class="information">
          <div class="order__confirmed" v-if="log.type===4">
            <p class="action_title">{{initiator}} подтвердил(-а) заказ:</p>
            <div class="order_information">
              <div class="order_date">{{log.data.order_type?'Разовая бронь': 'Долгосрочная бронь'}}: {{order_dates}}</div>
              <div class="order_details">Детали: {{details}}</div>
              <div class="order_playfield">Площадка: {{log.data.playfield}}</div>
              <div class="order_price">Общая сумма: {{log.data.total_price}} ₸</div>
              <div class="order_paytype">Способ оплаты: {{log.data.payment_type==='cash'?'Наличными':'По реквизитам'}}</div>
              <div class="order_discount">Скидка: {{log.data.total_discount}} ₸</div>
            </div>
          </div>
          <div class="order_completed" v-if="log.type===11">
            <p class="client_debt" v-if="log.data.debt>0">Заказ завершен. Долг клиента <span>{{log.data.debt}} ₸</span></p>
            <p class="playfield_debt" v-if="log.data.debt<0">Заказ завершена. Долг площадки <span>{{log.data.debt}} ₸</span></p>
            <p class="no_debt" v-if="log.data.debt===0">
              <img src="/img/check.svg" alt="no-debt">
              Заказ завершена. Долгов нет
            </p>
          </div>
          <div class="order_request" v-if="log.type===1">
            <p class="action_title">{{initiator}} отправил(-а) запрос на создание заказа</p>
          </div>
          <div class="booking_completed" v-if="log.type===10">
            <p class="client_debt" v-if="log.data.debt>0"><u>Бронь {{bookingDate}}</u> завершена. Долг клиента <span>{{log.data.debt}} ₸</span></p>
            <p class="playfield_debt" v-if="log.data.debt<0">Бронь завершена. Долг площадки <span>{{log.data.debt}} ₸</span></p>
            <p class="no_debt" v-if="log.data.debt===0">Бронь завершена. Долгов нет</p>
          </div>
          <div class="order_declined" v-if="log.type===5||log.type===2">
            <p class="action_title">
              <img src="/img/canceled_order.svg" alt="declined" >
              {{initiator}} отклонил(-а) заказ
            </p>
          </div>
          <div class="booking_canceled" v-if="log.type==9">
            <p class="action_title">
              <img src="/img/cancel_booking_history.svg" alt="canceled" >
              {{initiator}} отменил(-а) <u>бронь {{bookingDate}}</u>
            </p>
          </div>
          <div class="request_expired" v-if="log.type===3">
            <p class="action_title">
              <img src="/img/canceled_order.svg" alt="declined" >
              Истекло время запроса
            </p>
          </div>
          <div class="order_deposit" v-if="log.type===7">
            <p class="action_title">
              {{initiator}} добавил(-а) залог {{log.data.nova_deposit}} ₸<br>
              Сумма залога: {{log.data.deposit}} ₸
            </p>
          </div>
          <div class="order_all_discount" v-if="log.type===6">
            <p class="action_title">
              {{initiator}} добавил скидку в размере {{log.data.discount}} ₸ на все брони
            </p>
          </div>
          <div class="booking_edited" v-if="log.type===8">
            <p class="action_title">
              {{initiator}} внес изменения в <u>бронь {{bookingDate}}</u>
            </p>
          </div>
<!--          <div class="order_depositRefund" v-if="log.type===13">
            <p class="action_title">
              {{initiator}} внес изменения в <u>бронь {{bookingDate}}</u>
            </p>
          </div>-->
        </div>
      </div>
  </div>
</template>

<script>
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
//import customParseFormat from 'dayjs/plugin/customParseFormat'
import {mapState} from "vuex";
export default {
  props: ['log'],
  data(){
    return{
      url: window.location.origin.replace('playfields.', '')
    }
  },
  computed: {
    dateFormat(){
      return dayjs(this.log.created_at).format('DD.MM.YYYY, HH:mm')
    },
    photo(){
      if(this.log.initiator.type===1){
        return this.facility.avatar
      }
      else if(this.log.initiator.type===2){
        return `storage/profile_original_avatars/${this.order.client.avatar}`;
      }
      return '';
    },
    initiator(){
      if(this.log.initiator.type===1){
        return this.facility.fc_name
      }
      else if(this.log.initiator.type===2){
        return this.order.client.firstname;
      }
      else return  '';
    },
    bookingDate(){
      return dayjs(this.log.data.date).locale('ru').format('DD MMMM');
    },
    order_dates(){
      if(this.log.data.order_type){
        return dayjs(this.log.data.start_date).locale('ru').format('DD MMMM')
      }
      else return `${dayjs(this.log.data.start_date).locale('ru').format('DD MMMM')} - ${dayjs(this.log.data.end_date).locale('ru').format('DD MMMM')}`
    },
    details(){
      return `${this.log.data.start_time.substring(0, 5)} - ${this.log.data.end_time.substring(0, 5)}`
    },
    ...mapState('order', ['order']),
    ...mapState('facility', ['facility'])
  }
}
</script>

<style scoped lang="scss">
.order_history{
  background: #fff;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 14px;
  line-height: 20px;
  color: #222222;
  display: flex;
  .action_title{
    display: flex;
    align-items: center;
    img{
      margin-right: 5px;
    }
  }
.initiator{
  margin-right: 8px;
.initiator_img{
  width: 30px;
  height: 30px;
img{
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
}
}
.log{
  width: 100%;
.date{
  font-size: 10px;
  line-height: 20px;
  color: #9D9D9D;
}
.information{
.order_information{
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.54);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 8px 16px;
  margin-top: 8px;
div{
  margin-bottom: 4px;
}
}
.order_completed{
.client_debt, .playfield_debt{
span{
  color: #C03623;
}
}
}
  .booking_completed{
    .client_debt, .playfield_debt{
      span{
        color: #C03623;
      }
    }
    .no_debt{
      color: #2DCC70;
    }
  }
.order_edited{
.edit{
&_date, &_time, &_playfield, &_price{
                                display: flex;
                                margin-top: 8px;
                                font-size: 12px;
                                line-height: 20px;
                                color: #000000;
.old_value{
  color: #9D9D9D;
  flex: 1 1 0;
  overflow: hidden;
}
.new_value, .key{
  flex: 1 1 0;
  overflow: hidden;
}
}
}
}
}
}
.bold{
  font-weight: 500;
}
}
</style>