<template>
<div class="clientCard" :class="{'bottom': hasMenu}">
    <spinner :start = "start" />
    <div class="backdrop" v-show="help" @click.stop="help = false"></div>
    <div class="clientCard__inner" v-if="!start">
        <div class="client__info">
            <div class="info__left">
                <div class="name__surname">{{order_info.firstname}} {{order_info.lastname}}</div>
                <div class="company">{{company}}</div>
                <div class="call"><a :href="`tel:${client.phone}`">Позвонить <span>{{order_info.phone}}</span></a></div>
                <div class="text"><a :href="`https://api.whatsapp.com/send?phone=${order_info.phone}`" target="_blank">Написать в <span>WhatsApp</span></a></div>
            </div>
            <div class="info__right">
                <div class="client__photo">
                    <img :src="`${url}/storage/profile_original_avatars/${order_info.avatar}`" alt="Photo" v-if="client.avatar!=='default_avatar.png'">
                    <i  v-else class="fas fa-user-circle"></i>
                </div>
            </div>
        </div>
        <div class="order__info">
          <div class="order__amount_info">
            <p class="order__amount">Общее количество заказов: {{order_info.orders_count}}</p>
            <div class="order_types">
              <div class="order_type client_debt"></div>
              <div class="order_type fc_debt"></div>
              <div class="order_type deposit"></div>
              <div class="what_is_it" @click.stop="help = true">
                <img src="/img/help.svg" alt="Помощь">
              </div>
            </div>
          </div>
            <div class="order__current" @click.stop="goToSingleClient('activated')">
                <p>Активные: {{order_info.orders_activated}}</p>
              <div class="debts_btn">
                <div class="debts">
                  <div class="client_debt" v-if="order_info.debts_activated.client">{{order_info.debts_activated.client}} ₸</div>
                  <div class="fc_debt" v-if="order_info.debts_activated.admin">{{order_info.debts_activated.admin}} ₸</div>
                  <div class="deposit" v-if="order_info.deposits_activated">{{order_info.deposits_activated}} ₸</div>
                </div>

                <div class="btn">
                  <img src="/img/arrow-left.svg" alt="left">
                </div>
              </div>
            </div>
            <div class="order__finished" @click.stop="goToSingleClient('completed')">
                <p>Завершенные: {{order_info.orders_completed}}</p>
              <div class="debts_btn">
                <div class="debts">
                  <div class="client_debt" v-if="order_info.debts_completed.client">{{order_info.debts_completed.client}} ₸</div>
                  <div class="fc_debt" v-if="order_info.debts_completed.admin">{{order_info.debts_completed.admin}} ₸</div>
                  <div class="deposit" v-if="order_info.deposits_completed">{{order_info.deposits_completed}} ₸</div>
                </div>

                <div class="btn">
                  <img src="/img/arrow-left.svg" alt="left">
                </div>
              </div>
            </div>
            <div class="order__canceled" @click.stop="goToSingleClient('canceled')">
                <p>Отмененные: {{order_info.orders_canceled}}</p>
                <div class="debts_btn">
                  <div class="debts">
                    <div class="client_debt" v-if="order_info.debts_canceled.client">{{order_info.debts_canceled.client}} ₸</div>
                    <div class="fc_debt" v-if="order_info.debts_canceled.admin">{{order_info.debts_canceled.admin}} ₸</div>
                    <div class="deposit" v-if="order_info.deposits_canceled">{{order_info.deposits_canceled}} ₸</div>
                  </div>

                  <div class="btn">
                    <img src="/img/arrow-left.svg" alt="left">
                  </div>
                </div>
            </div>
        </div>
        <div class="payload__info">
            <p style="margin: 16px 0px;font-weight:500">Оплата</p>
            <div class="all__paid">
                <div class="key">Всего оплачено:</div>
                <div class="value">{{order_info.paid}} ₸</div>
            </div>
            <div class="remaining__current">
                <div class="key">Остаток по текущим заказам:</div>
                <div class="value">{{order_info.residue}} ₸</div>
            </div>
        </div>

      <div class="help_popup" v-show="help">
        <p class="help_title">Что означают цифры в цветных блоках?</p>
        <div class="order_types">
          <div class="debts">
            <div class="order_type client_debt"></div>
            <p>Долги клиента</p>
          </div>
          <div class="debts">
            <div class="order_type fc_debt"></div>
            <p>Возвраты (долги площадки)</p>
          </div>
          <div class="debts">
            <div class="order_type deposit"></div>
            <p>Залог</p>
          </div>
        </div>
      </div>
    </div>
</div>    
</template>
<script>
import {mapState} from 'vuex'
import axios from 'axios'
import Spinner from "./Spinner.vue";
export default {
    props:['client', 'clicked', 'hasMenu', 'company'],
    components: {Spinner},
    data(){
        return{
            order_info: {}, 
            start: true,
            click: this.clicked,
            url: window.location.origin.replace('playfields.', ''),
            help: false
        }
    },
  mounted() {
    this.start =  true;
    axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/orders-cli`, {
          client_id: this.client.id,
          is_temporary: this.client.is_temporary,
          facility_id: this.facility.id
        },
        {
          headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
        }).then((e)=>{
          this.order_info = e.data.orders;
          this.start = false;
        }
    ).catch((e)=>console.log(e));
  },
  computed: {
        ...mapState('facility', ['facility'])
  },
  methods: {
      goToSingleClient(tab){
        this.$router.push({name:'singleClient', params: {id: this.client.id, tab: tab, is_temp: this.client.is_temporary}});
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
.clientCard{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 36;
    min-height: 415px;
  &__inner{
    padding: 16px;
  }
}

.bottom{
    bottom: 49px;
}
.client{
    &__info{
        display: flex;
        margin-bottom: 16px;
    }
    &__photo{
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        img, i {
            width: 100%;
            height: 100%;
            font-size: 64px;
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, 0.2);
        }
    }
}
.info{
    &__left{
        width: 75%;
    }
    &__right{
        width: 25%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
.name__surname{
    font-weight: 500;
    font-size: 20px;
    line-height: 32px;
}
.call{
    margin-top: 8px;
    margin-bottom: 4px;
    a{
        color: #000;
        text-decoration: none;
    }
    span{
        text-decoration: underline;
    }
}
.text{
    a{
        color: #000;
        text-decoration: none;
    }
    span{
        text-decoration: underline;
    }
}
.order{
    &__amount{
        font-weight: 500;
      &_info{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
    }
  &_type{
    width: 20px;
    height: 8px;
    margin-right: 4px;
  }

  &_types{
    display: flex;
    align-items: center;
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
    &__current, &__finished, &__canceled{
        margin-bottom: 8px;
        background: rgba(0, 0, 0, 0.04);
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
.btn{
    width: 24px;
    height: 24px;
    background: #FFFFFF;
    filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.161));
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      transform: rotate(-180deg);
      width: 5px;
      height: 9px;
    }
}
.all__paid, .remaining__current, .debt{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.all__paid{
  margin-top: 16px;
  margin-bottom: 8px;
}
.debt>.value{
    color: #FF4D4D;
}

.help_popup{
  padding: 16px;
  background: #fff;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 22;
  min-width: 343px;
  border-radius: 8px;
  .help_title{
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 16px;
  }
  .order_types{
    display: block;
  }
  .debts{
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    p{
      margin-left: 4px;
    }
  }
}
.backdrop{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.25);
  z-index: 21;
}
</style>