<template>
  <div class="history_card">
    <div class="initiator" v-if="log.initiator">
      <div class="initiator_img">
        <img :src='`${url}/${photo}`' alt="photo"/>
      </div>
    </div>
    <div class="log">
      <div class="date">{{dateFormat}}</div>
      <div class="information">
        <div class="booking_activated" v-if="log.type===1">
          <p class="action_title">Активирована бронь:</p>
          <div class="booking_information">
            <div class="order_id bold">Заказ №{{log.data.order_id}}</div>
            <div class="booking_date">Дата: {{day}}</div>
            <div class="booking_details">Детали: {{details}}</div>
            <div class="booking_playfield">Площадка: {{log.data.playfield}}</div>
            <div class="booking_price">Стоимость: {{log.data.price}} ₸</div>
            <div class="booking_paytype">Способ оплаты: {{log.data.payment_type==='cash'?'Наличными':'По реквизитам'}}</div>
            <div class="booking_discount">Скидка: {{log.data.discount}} ₸</div>
          </div>
        </div>
        <div class="booking_completed" v-if="log.type===5">
          <p class="client_debt" v-if="log.data.debt>0">Бронь завершена. Долг клиента <span>{{log.data.debt}} ₸</span></p>
          <p class="playfield_debt" v-if="log.data.debt<0">Бронь завершена. Долг площадки <span>{{log.data.debt}} ₸</span></p>
          <p class="no_debt" v-if="log.data.debt===0">Бронь завершена. Долгов нет</p>
        </div>
        <div class="booking_edited" v-if="log.type===4">
          <p class="action_title">{{facility.fc_name}} внес(-ла) изменения в бронь</p>
          <div class="edit_table">
            <div class="edit_date">
              <div class="key">Дата:</div>
              <div class="old_value">{{old_date}}</div>
              <div class="new_value" :class="{'notChanged': old_date===new_date}">{{new_date}}</div>
            </div>
            <div class="edit_time">
              <div class="key">Время:</div>
              <div class="old_value">{{old_time}}</div>
              <div class="new_value" :class="{'notChanged': old_time===new_time}">{{new_time}}</div>
            </div>
            <div class="edit_playfield">
              <div class="key">Площадка:</div>
              <div class="old_value">{{log.data.old_playfield}}</div>
              <div class="new_value" :class="{'notChanged': log.data.old_playfield===log.data.new_playfield}">{{log.data.new_playfield}}</div>
            </div>
            <div class="edit_price">
              <div class="key">Цена:</div>
              <div class="old_value">{{log.data.old_price}}</div>
              <div class="new_value" :class="{'notChanged': log.data.old_price===log.data.new_price}">{{log.data.new_price}}</div>
            </div>
          </div>
        </div>
        <div class="booking_paid" v-if="log.type===3">
          <p class="action_title">{{facility.fc_name}} добавил(-а) оплату в размере {{log.data.paid}} ₸<br>Остаток: {{log.data.balance}} ₸</p>
        </div>
        <div class="booking_canceled" v-if="log.type===6">
          <p class="action_title">{{initiator}} отменил(-а) бронь</p>
        </div>
        <div class="booking_discount" v-if="log.type===2">
          <p class="action_title">{{facility.fc_name}} добавил(-а) скидку в размере {{log.data.discount}} ₸<br>Сумма скидок: {{log.data.total_discount}} ₸</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
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
    day(){
      return dayjs(this.log.data.date).locale('ru').format('DD MMMM');
    },
    details(){
      const time = `${this.log.data.start_time.substring(0, 5)} - ${this.log.data.end_time.substring(0, 5)}`;
      return time;
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
    old_date(){
      return dayjs(this.log.data.old_date).locale('ru').format('DD MMMM');
    },
    new_date(){
      return dayjs(this.log.data.new_date).locale('ru').format('DD MMMM');
    },
    old_time(){
      return `${this.log.data.old_start_time.substring(0, 5)} - ${this.log.data.old_end_time.substring(0, 5)}`;
    },
    new_time(){
      return `${this.log.data.new_start_time.substring(0, 5)} - ${this.log.data.new_end_time.substring(0, 5)}`;
    },
    ...mapState('facility', ['facility']),
    ...mapState('order', ['order'])
  }
}
</script>

<style scoped lang="scss">
.history_card{
  background: #fff;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 14px;
  line-height: 20px;
  color: #222222;
  display: flex;
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
      .booking_information{
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
      .booking_edited{
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
            .notChanged{
              color: #9D9D9D;
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