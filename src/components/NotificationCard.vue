<template>
  <div class="notification_card" @click.stop="goToOrder()">
    <div class="notification_card_inner">
      <div class="main_line">
        <div class="left">
            <div class="notification_logo">
              <img :src="srcIcon" alt="nf_logo"/>
            </div>
            <div class="order_info">{{orderInfo}}</div>
        </div>
          <div class="notification_date">{{createdAt}}</div>
      </div>
      <div class="notification_info">
        {{orderTime}}
      </div>
      <div class="notification_message">
        {{orderMessage}}
      </div>
    </div>
  </div>
</template>

<script>
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
  props: ['notification'],
  methods:{
    goToOrder(){
      this.$router.push({name: 'singleOrder', params:{id: this.notification.data.order_id}});
    }
  },
  computed: {
    orderTime(){
      const s_date = dayjs(this.notification.data.start_date).locale('ru').format('DD MMMM');
      const e_date = dayjs(this.notification.data.end_date).locale('ru').format('DD MMMM');
      const time = `${this.notification.data.start_time.substring(0, 5)} - ${this.notification.data.end_time.substring(0, 5)}`;
      const day = dayjs(this.notification.data.start_date).locale('ru').format('dddd');
      return `${s_date} - ${e_date}, ${time}, ${day}`;
    },
    orderInfo(){
      return `Заказ №${this.notification.data.order_id}, броней ${this.notification.data.bookings_count}`
    },
    createdAt(){
      return dayjs(this.notification.created_at).format('DD.MM.YYYY HH:mm')
    },
    srcIcon() {
      if (this.type===0) {
        return '/img/canceled_booking.svg';
      } else if (this.type===1) {
        return '/img/canceled_order.svg';
      } else if (this.type===2) {
        return '/img/accepted.svg';
      } else if (this.type===3) {
        return '/img/request.svg';
      }
      return '';
    },
    type(){
      let type = this.notification.type;
      if (type.includes('ReservationCanceledByClient')) {
        return 0;
      } else if (type.includes('OrderDeclineByClient')) {
        return 1;
      } else if (type.includes('OrderAcceptByClient')) {
        return 2
      } else if (type.includes('OrderMakeByClient')) {
        return 3;
      }
      return '';
    },
    orderMessage(){
      if(this.type===0){
        return `${this.notification.data.client_name} отменил(-а) бронь ${dayjs(this.notification.data.reservation_date).locale('ru').format('DD MMMM')} в заказе №${this.notification.data.order_id}`;
      }
      else if(this.type===1){
        return  `${this.notification.data.client_name} отменил(-а) заказ №${this.notification.data.order_id}`;
      }
      else if(this.type===2){
        return `${this.notification.data.client_name} подтвердил(-а) заказ`;
      }
      else if(this.type===3){
        return `${this.notification.data.client_name} хочет забронировать ${this.notification.data.playfield}`;
      }
      return  '';
    }
  }

}
</script>

<style  lang="scss" scoped>
.notification{
  &_card{
    box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.05);
    padding: 16px;
    .main_line{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.6);
      .left{
        display: flex;
      }
      .notification_logo{
        margin-right: 13px;
      }
    }
    .notification_info{
      font-size: 11px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 8px;
    }
    .notification_message{
      font-size: 14px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.87);
    }
    .notification_info, .notification_message{
      padding-left: 24px;
    }
  }
}
</style>