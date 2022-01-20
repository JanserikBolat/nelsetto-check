<template>
    <div class="single__order" v-if="!sending">
        <error-card :message="message" v-if="hasError" @close="hasError = false;"/>
        <div v-if="show||showConditions||hasError" class="backdrop" @click.stop="show = false; showConditions=false; hasError = false"></div>
        <ConfirmHeader @back="back">
            <template v-slot:main>
                <p class="order__id">Заказ №{{order.id}}</p>
            </template>
            <template v-slot:status>
                <p class="order__status">{{getOrderStatus}}</p>
            </template>
        </ConfirmHeader>

      <confirmation-card v-if="order.status==='pending'&&!order.is_owner" :fromNelsette="!order.client.is_temporary"/>

      <div class="client_interaction" v-if="order.status==='pending'&&order.is_owner">
        <div class="call"><a :href="`tel:${order.client.phone}`">Позвонить</a></div>
        <div class="text"><a :href="`https://api.whatsapp.com/send?phone=${order.client.phone}`" target="_blank">Написать в WhatsApp</a></div>
      </div>

      <div class="toggle__mode">
          <div class="information" :class="activeTab==='info'?'activeTab':''" @click="activeTab='info'">
            Информация
            <div class="bottomLine"></div>
          </div>
          <div class="history" :class="activeTab==='history'?'activeTab':''" @click="activeTab='history'">
            История
            <div class="bottomLine"></div>
          </div>
        </div>
      <div class="info" v-if="activeTab==='info'">
        <OrderInfo :buttonNeeded="false"></OrderInfo>
        <div class="confirm__popup" v-show="show">
          <div class="popup__inner">
            <i class="fas fa-times" @click="show=false"></i>
            <p class="confirm__text">Вы уверены, что хотите отменить все?</p>
            <div class="confirm__buttons">
              <div class="button__yes" @click="cancelOrder(true)">Да</div>
              <div class="button__no" @click="cancelOrder(false)">Нет</div>
            </div>
          </div>
        </div>
        <div class="booking__status" v-if="!order.is_owner||!(order.is_owner&&!order.type&&order.status==='pending')">
          <div class="bookingStatus__inner">
            <p>Брони</p>
            <div class="statuses">
              <div class="upcoming" :class="{'active':active==='upcoming'}" @click="active='upcoming'">
                Предстоящие: {{activeCount}}
                <div class="line"></div>
              </div>
              <div class="finished" :class="{'active':active==='finished'}" @click="active='finished'">
                Завершенные: {{finishedCount}}
                <div class="line"></div>
              </div>
              <div class="canceled" :class="{'active':active==='canceled'}" @click="active='canceled'">
                Отмененные: {{canceledCount}}
                <div class="line"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="cancel__order" v-if="order.status==='activated'&&active==='upcoming'&&this.filteredBookings.length">
          <p class="cancel__order_btn" @click="show=true" :class="{'canCancel':order.deposit===0&&order.status==='activated'}">Отменить брони</p>
          <p class="cancel__order_conditions" @click="showConditions = true">Условия отмены</p>
        </div>
        <div class="condition__popup" v-if="showConditions">
          <div class="condition__popup_inner">
            <p class="condition__title">Отмена броней</p>
            <p class="condition one">Нажатием кнопки "Отменить брони", вы отменяете все брони за которые не была внесена предоплата.</p>
            <div class="condition two">Отмена броней невозможна если был внесён залог.</div>
            <div class="close__popup" @click="showConditions=false">Закрыть</div>
          </div>
        </div>
        <div class="booking_availability" v-if="order.status==='pending'&&order.is_owner" ref="booking_availibilty">
          <div class="content">
            <template v-for="b in bookings">
              <date-header :date="getDate(b.date)" :key="b.date"/>
              <simple-timetable :date="getDate(b.date)" :key="b.id" @move='move' :reservation="b" :client="order.client"/>
            </template>
          </div>
        </div>
        <div class="miniCards" v-if="!order.is_owner||!(order.is_owner&&!order.type&&order.status==='pending')">
          <MiniOrderCard v-for="b,index in filteredBookings" :booking="b" :key="index"/>
        </div>
        <div class="noBookings" v-if="filteredBookings.length===0">
          <p v-show="active==='upcoming'">Нет предстоящих заказов</p>
          <p v-show="active==='finished'">Нет завершенных заказов</p>
          <p v-show="active==='canceled'">Нет отмененных заказов</p>
        </div>
        <div class="order_actions" v-if="order.status==='pending'&&order.is_owner">
          <div class="order_accept" @click.stop="acceptOrder()">Подтвердить</div>
          <div class="order_decline" @click.stop="declineOrder()">Отклонить</div>
        </div>
      </div>

      <div class="history_info" v-if="activeTab==='history'">
        <order-history :logs="logs" />
      </div>
    </div>
</template>
<script>
import {mapGetters, mapState} from 'vuex'
import ConfirmHeader from '../components/ConfirmHeader.vue'
import OrderInfo from '../components/OrderInfo.vue'
import MiniOrderCard from '../components/MiniOrderCard.vue'
import ConfirmationCard from '../components/ConfirmationCard.vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import axios from 'axios'
import SimpleTimetable from '../components/SimpleTimetable.vue'
import DateHeader from '../components/DateHeader.vue'
import OrderHistory from "../components/OrderHistory";
import ErrorCard from "../components/ErrorCard";
export default {
    props: ['id'],
    data(){
        return{
            show: false,
            active: 'upcoming',
            activeTab: 'info',
            remainForBooking: 0,
            showConditions: false,
            bookings:[],
            url: window.location.origin.replace('playfields.', ''),
            reservations: [],
            sending: true,
            hasError: false,
            logs: [],
            message: 'Что-то пошло не так!'
        }
    },
    async mounted(){
        window.scrollTo(0,0);
        await this.getSingleOrder();
        this.getBookings(this.active);
    },
  components: {
    ErrorCard,
    OrderHistory, ConfirmHeader, OrderInfo, MiniOrderCard,ConfirmationCard, SimpleTimetable, DateHeader},
  computed: {
     ...mapState('order', ['order']),
      ...mapGetters('order', ['getAllPaid', 'getRemainMoney']),
        IsArchive(){
            return this.order.status==='canceled'||this.order.status==='completed';
        },
        containsUnpaid(){
            return this.filteredBookings.filter(e=>e.paid===0).length!==0
        },
        getOrderStatus(){
            switch(this.order.status){
                case 'pending': 
                    return 'В ожидании';
                case 'activated':
                    return 'Подтвержден';
                case 'canceled': 
                    return 'Отменен';
                case 'completed': 
                    return 'Завершен';
                case 'rejected':
                    return 'Отклонен'
                default:
                    return '';
            }
        },
        activeCount(){
            return this.bookings.filter(b=>b.status==='activated'||b.status==='pending').length;
        },
        canceledCount(){
            return this.bookings.filter(b=>b.status==='canceled').length;
        },
        finishedCount(){
            return this.bookings.filter(b=>b.status==='completed').length;
        },
        filteredBookings(){
            switch(this.active){
                case 'upcoming':
                    return this.bookings.filter(e=>e.status==='pending'||e.status==='activated');
                case 'finished':
                    return this.bookings.filter(e=>e.status==='completed');
                case 'canceled':
                    return  this.bookings.filter(e=>e.status==='canceled');
                default:
                    return [];
          }
        },

  },
  methods: {
      move(l){
        this.$nextTick(()=>{
          this.$refs['booking_availibilty'].scrollLeft=l*9/10;
        });
        },
      back(){
          this.$router.push({name: 'orders'});
      },
        getDate(d){
            return dayjs(d);
    },
      getBookings(status){
          this.active = status
      },
        isMoreThanSevenDays(date){
            return dayjs(date).diff(dayjs())>7
        },
        async cancelOrder(bool){
            if(bool){
                await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/order/${this.order.id}/cancel-reservations`, {}, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}}).then(async ()=> {
                    this.active = "canceled";
                    await this.getSingleOrder();
                    }).catch((err)=>{
                      this.hasError = true;
                      this.message = err.response.data.error;
                })
            }
            this.show = false;
        },
        async getSingleOrder(){
            await axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/order/${this.id}`, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(res=>{
                this.$store.dispatch('order/setOrder', res.data.order);
                this.$store.dispatch('booking/setBooking', res.data.order.booking[0]);
                this.bookings = [...this.order.booking];
                this.sending = false;
            });

            await axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/order/${this.id}/history`, {
              headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(res=>this.logs = res.data.history);
        },
        acceptOrder(){
            axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/order/${this.id}/accept-btn`, {}, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(res=>{
                if(res.status===200){
                    window.location.reload();
                }
            })
        },
        declineOrder(){
            axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/order/${this.id}/decline-btn`, {}, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(res=>{
                if(res.status===200){
                    window.location.reload();
                }
            })
        },
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
.single__order{
    background: #E5E5E5;
    min-height: 100vh;
  .client_interaction{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    margin-bottom: 16px;
    a{
      text-decoration: none;
      color: #53D37E;
      font-weight: 500;
      text-transform: uppercase;
    }
  }
  .toggle__mode{
    display: flex;
  }
  .information, .history{
    width: 50%;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #F9F9F9;
    color: #90A4AE;
    position: relative;
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 1.25px;
    text-transform: uppercase;

  }
  .bottomLine{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: #03A9F4;
    display: none;
  }
  .activeTab{
    color: #03A9F4;
    background: #fff;
    box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.05);
    .bottomLine{
      display: block;
    }
  }
}
.cancel__order{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    p{
        font-size: 12px;
        line-height: 24px;
    }
    &_btn{
        color: rgba(0, 0, 0, 0.38);
        pointer-events: none;
    }
    &_conditions{
        padding: 4px;
        background: #fff;
    }
    .canCancel{
        color: #eb6f62;
        pointer-events: all;
    }
}

.condition{
    &__popup{
        padding: 24px 16px;
        background: #fff;
        z-index: 10;
        position: fixed;
        bottom: 0;
        .condition{
            margin-bottom: 16px;
        }
        .close__popup{
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 500;
            font-size: 13px;
            line-height: 16px;
            text-align: center;
            letter-spacing: 1.25px;
            text-transform: uppercase;
            color: #03A9F4;
        }
    }
    &__title{
        font-weight: 500;
        font-size: 20px;
        line-height: 32px;
        color: rgba(0, 0, 0, 0.87);
        margin-bottom: 16px;
    }

}
.confirm__popup{
    width: 80%;
    height: 50%;
    max-width: 500px;
    max-height: 230px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    z-index: 11;
    padding: 20px;
    .popup__inner{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        position: relative;
        i{
            position: absolute;
            top: 0;
            right: 0;
        }
        .confirm__buttons{
            display: flex;
            width: 100%;
            .button__yes, .button__no{
                width: 50%;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
            }
            .button__no{
                background: #50CB93;
            }
            .button__yes{
                background: #BD1616;
            }
    }
}
}
.booking__status{
    height: 88px;
    background: #fff;
    margin: 16px 0px;
    font-size: 12px;
    line-height: 14px;
    padding: 16px 16px 0 16px;
    p{
        font-weight: 500;
        font-size: 12px;
        line-height: 24px;
    }
    .statuses{
        height: 48px;
        width: 100%;
        display: flex;
        .upcoming, .canceled, .finished{
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            font-size: 12px;
            width: 33.3%;
        }
        .active>.line{
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 2px;
                background: #000;
            }
            .active{
                font-weight: 500;

            }
    }
}
.booking_availability{
    overflow: scroll;
    margin-top: 16px;
}
.miniCards, .noBookings{
    padding: 16px 16px 8px 16px;
}
.miniCards{
  padding-bottom: 60px;
}
.noBookings{
    display: flex;
    height: 300px;
    justify-content: center;
    align-items: center;
}
.order_actions{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 14px 8px;
    display: flex;
    z-index: 20;
    background: #fff;
    box-shadow: 0px -1px 10px rgba(0, 0, 0, 0.14), 0px 3px 14px rgba(0, 0, 0, 0.12), 0px 5px 5px rgba(0, 0, 0, 0.2);
    .order_accept{
        width: 50%;
        background: #000;
        color: #fff;
        margin-right: 4px;
        padding: 5px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .order_decline{
        width: 50%;
        background: #fff;
        color: #000;
        padding: 5px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #A9A9A9;
    }
}
.content{
  width: max-content;
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