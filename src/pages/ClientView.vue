<template>
    <div class="clients__wrapper">
      <spinner :start="sending" />
        <MainHeader @changed="changed">
            <template v-slot:title>
                <p class="title">Клиенты</p>
            </template>
        </MainHeader>
        <div class="client_filters">
          <div class="filter_input">
            <input type="text" v-model="filter" placeholder="Введите имя или номер телефона">
            <img src="/img/search.svg" alt="найти">
          </div>
          <div class="filter_dropdown">
            <select v-model="filterType" class="order__type">
              <option v-for="type, index in filterTypes" :key="index">{{type}}</option>
            </select>
          </div>
        </div>
        <p class="client__amount">
            Клиентов: {{searchedClients.length}}
        </p>
        <div class="clientCards">
            <Client v-for="client in searchedClients" :key="client.id" :client="client" :filter="filterTypeFormat"/>
        </div>
        <bottom-menu active="clients"/>
    </div>
</template>
<script>
import  Client from '../components/Client.vue'
import BottomMenu from '../components/BottomMenu.vue'
import MainHeader from '../components/MainHeader.vue'
import axios from 'axios'
import {mapState} from 'vuex'
import Spinner from "../components/Spinner";
export default {
    components: {Spinner, Client, BottomMenu,MainHeader},
    data(){
        return{
            clients: [],
            filter: '',
            sending: true,
            filterType: 'Количество активных броней',
            filterTypes: ['Количество активных броней', 'Долги клиентов', 'Долги площадки', 'Залоги клиентов'],
            url: window.location.origin.replace('playfields.', '')
        }
    },
    watch: {
        'facility.id': async function(){
            window.scrollTo(0,0)
            await this.getClients();
        },
        filterType: async function (){
            await this.getClients();
        },
    },
    async mounted(){
        window.scrollTo(0,0)
        await this.getClients();
    },
    methods:{
        changed(id){
            this.start = true;
            this.$store.dispatch('facility/resetFacility', parseInt(id)).then(()=>this.start = false);
            sessionStorage.setItem('active_facility', parseInt(id))
        },
        async getClients(){
          this.sending = true;
            axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${sessionStorage.getItem('active_facility')}/users`,{
              sort: this.filterTypeFormat,
              facility_id: this.facility.id
            },{
            headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(e=>{
              this.clients = e.data.clients;
            }).finally(()=> this.sending = false);
        }
    },
    computed: {
        ...mapState('facility', ['facility']),
      filterTypeFormat(){
          switch (this.filterType){
            case 'Количество активных броней':
              return 0;
            case 'Долги клиентов':
              return 1;
            case 'Долги площадки':
              return 2;
            case 'Залоги клиентов':
              return 3;
            default:
              return 0;
          }
      },
      searchedClients(){
          const lowFilter = this.filter.trim().toLowerCase();
          return this.clients.filter(e=>e.firstname.toLowerCase().includes(lowFilter)||e.lastname.toLowerCase().includes(lowFilter)||e.phone.includes(this.filter));
      }
    }
}
</script>
<style lang="scss" scoped>
.clients__wrapper{
    min-height: 100vh;
    background: #E5E5E5;
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    .client_filters{
      padding: 16px;
      background: #fff;
      margin-top: 98px;
      .filter_input {
        position: relative;
        margin-bottom: 16px;
        input {
          background: #E9E9E9;
          border-radius: 12px;
          width: 100%;
          height: 44px;
          border: none;
          outline: none;
          padding-left: 48px;
        }

        img {
          width: 18px;
          height: 18px;
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .filter_dropdown{
        select{
          border: none;
          outline: none;
          background: #fff;
        }
      }
    }
    p{
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
    }
    .client__amount{
        padding: 16px;
    }
    .client__title{
        font-weight: 500;
        font-size: 20px;
        line-height: 32px;
    }
    .clientCards{
        margin-bottom: 49px;
    }
}
</style>