<template>
  <div class="single_client" v-if="!sending">
    <div class="single_client_header">
      <div class="backToOrders">
        <div class="back__button" @click.stop="back()">
          <i class="fas fa-chevron-left"></i>
        </div>
      </div>
      <div class="header_title">
        <div class="client_name">
          {{client.firstname}} {{client.lastname}}
        </div>
      </div>
    </div>

    <div class="client__info">
      <div class="info__left">
        <div class="name__surname">{{client.firstname}} {{client.lastname}}</div>
        <div class="call"><a :href="`tel:${client.phone}`">Позвонить <span>{{client.phone}}</span></a></div>
        <div class="text"><a :href="`https://api.whatsapp.com/send?phone=${client.phone}`" target="_blank">Написать в <span>WhatsApp</span></a></div>
      </div>
      <div class="info__right">
        <div class="client__photo">
          <img :src="`${url}/storage/profile_original_avatars/${client.avatar}`" alt="Photo" v-if="client.avatar!=='default_avatar.png'">
          <i  v-else class="fas fa-user-circle"></i>
        </div>
      </div>
    </div>

    <div class="orders_tab">
      <div class="order_tab" :class="{'active': activeTab==='activated'}" @click.stop="activeTab='activated'">
        Активные
      </div>
      <div class="order_tab" :class="{'active': activeTab==='completed'}" @click.stop="activeTab='completed'">
        Завершенные
      </div>
      <div class="order_tab" :class="{'active': activeTab==='canceled'}" @click.stop="activeTab='canceled'">
        Отмененные
      </div>
    </div>

    <div class="order_cards">
      <template v-for="order in filteredOrders">
        <order-card  :key="order.id" :order="order" :debts_needed="true"/>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import OrderCard from "../components/OrderCard.vue";
import {mapState} from 'vuex';
export default {
  components: {OrderCard},
  props: ['id', 'tab', 'is_temp'],
  data(){
    return{
      client: {},
      orders: [],
      sending: true,
      activeTab: this.tab||'activated',
      url: window.location.origin.replace('playfields.', '')
    }
  },
  methods: {
    back(){
      this.$router.go(-1);
    }
  },
  mounted() {
    this.sending = true;
    axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/orders-cli-list`, {
      client_id: this.id,
      is_temporary: this.is_temp,
      facility_id: this.facility.id
    },{
      headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
    }).then((res)=>{
      this.client = res.data.client;
      this.orders = res.data.orders;
      this.sending = false;
    }).catch(e=>alert(e));
  },
  computed: {
    filteredOrders(){
      switch (this.activeTab){
        case 'activated':
          return this.orders.filter(e=>e.status==='activated');
        case 'completed':
          return this.orders.filter(e=>e.status==='completed');
        case 'canceled':
          return this.orders.filter(e=>e.status==='canceled');
        default:
          return [];
      }
    },
    ...mapState('facility', ['facility'])
  }
}
</script>

<style scoped lang="scss">
:not(i){
  font-size: 14px;
  line-height: 20px;
}
.single_client{
  background: #F9F9F9;
  min-height: 100vh;
  &_header{
    padding: 8px;
    box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    background: #fff;
    .header_title{
      margin-left: 16px;
    }
    .client_name{
        font-weight: 500;
        font-size: 20px;
        line-height: 32px;
    }
    .back__button{
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04);
    }
  }
  .client{
    &__info{
      display: flex;
      padding: 16px;
      box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.05);
      background: #fff;
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
  .orders_tab{
    display: flex;
    margin-bottom: 16px;
    .order_tab{
      flex: 1 1 0;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 1.25px;
      text-transform: uppercase;
      color: #90A4AE;
      height: 48px;

      display: flex;
      align-items: center;
      justify-content: center;
    }
    .active{
      color: #03A9F4;
      background: #fff;
      border-bottom: 2px solid #03A9F4;
    }
  }
}
</style>