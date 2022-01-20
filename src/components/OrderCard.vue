<template>
    <div class="order__card" @click="singleOrder()">
        <div class="orderCard__inner">
            <div class="card__top">
                <div class="little__status">
                    <p v-show="order.status==='pending'" class="status pending">В ожидании</p>
                    <p v-show="order.status==='completed'" class="status completed">Завершен</p>
                    <p v-show="order.status==='canceled'" class="status canceled">Отменен</p>
                    <p v-show="order.status==='activated'" class="status activated">Активный</p>
                  <p v-show="order.status==='rejected'" class="status rejected">Отклонен</p>
                </div>
                <div class="created_date">
                    <p>{{formatDateFull}}</p>
                </div>
            </div>
            <div class="card__little">
                <div class="little__left">
                    <p class="order__id">Заказ №{{order.id}}</p> 
                    <p class="booking__amount" v-if="order.bookings_count>1">Брони: {{order.bookings_count}}</p>
                </div>
                <div class="little__right">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
            <div class="card__content">
                <div class="content__left">
                    <p class="date">{{formatDate(order.start_date)}}{{!order.type? ` - ${formatDate(order.end_date)}`:''}}</p>
                    <p class="time">{{getTime}}</p>
                    <p class="field">{{order.booking.playfield.pf_name}}</p>
                </div>
                <div class="content__right">
                    <ClientCardMini :client="order.client" :company="order.company" v-if="order.client"/>

                  <div class="debts_btn" v-if="debts_needed">
                    <div class="debts">
                      <div class="client_debt" v-if="order.debt>0">{{order.debt}} ₸</div>
                      <div class="fc_debt" v-if="order.debt<0">{{order.debt}} ₸</div>
                      <div class="deposit" v-if="order.deposit">{{order.deposit}} ₸</div>
                    </div>
                  </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import ClientCardMini from '../components/ClientCardMini.vue'
export default {
    props: ['order', 'debts_needed'],
    components:{
        ClientCardMini
    },
    data(){
        return{
            show: false
        }
    },
    methods: {
        formatDate(date){
            return dayjs(date).locale('ru').format('DD MMMM')
        },
        singleOrder(){
            this.$router.push({name:'singleOrder', params: {id: this.order.id}});
        },
        closePopup(){
            this.show = false;
        }
    },
    computed: {
        formatDateFull(){
            return dayjs(this.order.created_at).format('DD.MM.YYYY, HH:mm')
        },
        getTime(){
            return `${this.order.booking.start_time.substring(0,5)} - ${this.order.booking.end_time.substring(0,5)}`
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
.order__card{
    background: #fff;
    margin-bottom: 16px;
    .orderCard__inner{
        padding: 8px 16px;
    }
}
.card{
    &__content{
        display: flex;
        align-items: center;
    }
    &__top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 16px;
        p{
            font-size: 10px;
            font-weight: 500;
        }
        .created_date{
            color: #9D9D9D;
        }
        .little__status{
            .pending{
                color: #E3B205;
            }
            .canceled{
              color: #03A9F4;
          }
            .rejected{
              color: #C20000;
            }
            .activated{
                color: #959595;
            }
            .completed{
                color: #4A4A4A;
            }
        }
    }
    &__little{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 16px;
    .little__left{
        display: flex;
        margin-bottom: 8px;
    }
    .order__id{
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.15px;
        margin-right: 8px;
    }
    .booking__amount{
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.15px;
    }
}
}
.content{
        &__left, &__right{
            width: 50%;
        }
        &__right{
            display: flex;
            justify-content: flex-end;
          .debts_btn{
            display: flex;
            .debts{
              display: flex;
              div{
                margin-right: 8px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 14px;
                color: #fff;
                padding: 4px;
              }
              .client_debt{
                background: #FF5252;
              }
              .fc_debt{
                background: #F9D100;
              }
              .deposit{
                background: #626262;
              }
            }
          }
        }
    }
.user__description{
    width: fit-content;
    padding: 9.67px;
    min-height: 36px;
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