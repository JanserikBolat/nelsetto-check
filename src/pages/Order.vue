<template>
    <div class="order__wrapper">
      <spinner :start="start"/>
        <order-header>
            <template v-slot:orderHeader>
                <p class= "new__order">Новый заказ</p>
                <div class="close__order" @click="goBack()">
                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                </div>
            </template>
            <template v-slot:headerBottom>
                <div class="header__bottom">
                    <p>Добавление клиента</p>
                </div>
            </template>
        </order-header> 
        <order-info-before :buttonNeeded = true :orderYourself="orderYourself"/>
        <div class="search__input">
            <label  class="phone__label" for="phone">Номер телефона</label><br>
            <div class="phone_wrapper">
              <input
                @keypress.stop="isNumber($event)"
                type="tel"
                name="phone"
                id="phone"
                v-mask="'+7 ### ### ## ##'"
                placeholder="Введите номер телефона" v-model="search"
                ref="telephone"
                @paste="onPaste($event)">
                <img src="/img/contacts.svg" alt="contact"  @click.stop="getContacts" v-if="isSupported">
            </div>
          <p v-show="noDuplicateContacts.length>1" class="another_phone">Выбрать другой номер</p>
          <select v-model="search" class="client_select" v-show="noDuplicateContacts.length>1" ref="select_phone">
            <option v-for="(phone, index) in noDuplicateContacts" :key="index">{{phone}}</option>
          </select>

        </div>
      <div class="actions">
        <div class = "continue__btn" @click="searchNumber()" :class="{'valid': isValid}">Продолжить</div>

        <div class="order_yourself">
          <input type="checkbox" id="yourself" v-model="orderYourself">
          <label for="yourself">Забронировать на себя</label>
        </div>
      </div>
    </div>
</template>
<script>
import OrderInfoBefore from '../components/OrderInfoBefore.vue'
import OrderHeader from '../components/OrderHeader.vue'
import Spinner from "../components/Spinner.vue";
import axios from 'axios'
import { mapState } from 'vuex'
export default {
    components: { OrderInfoBefore, OrderHeader, Spinner},
    data(){
        return{
            search: '',
            discount: 0,
            client: {},
            contacts: [],
            orderYourself: false,
            start: false,
            url: window.location.origin.replace('playfields.', '')
        }
    },
    mounted(){
        window.scrollTo(0,0);
    },
  watch:{
      orderYourself: function (value){
        if(value){
          this.search = window.$cookies.get('phone');
        }
        else this.search = "";
      },
      search: function (value){
        if(value.split(' ').join('')===window.$cookies.get('phone')){
          this.orderYourself = true;
        }
        else {
          this.orderYourself = false;
        }
      }
  },
    methods: {
        async searchNumber(){
          this.start = true;
            await axios.post( `https://almvtst.ml/crm/user/${window.$cookies.get('id')}/client-interaction`, {phone: `${this.search.split(' ').join('')}`},
              {
                headers: {
                    'Authorization': `Bearer ${window.$cookies.get('access_token')}`
                }
            }).then(e=>{
              this.$store.dispatch('order/setClient', e.data.client)
              this.$router.push({name: 'registerUser', params: {'is_crm': this.orderYourself}})
            }).finally(()=>this.start = false);

        },
      async getContacts(){
          const props = ['name', 'tel'];
          const opts = {multiple: false};
          try{
            const localContacts = await navigator.contacts.select(props, opts);

            this.contacts = localContacts.map(e=>e.tel.map(el=>
            {
             let onlyDigits = el.replace(/\D/g,'');

             return `+7${onlyDigits.substring(onlyDigits.length-10)}`
            }
            ))[0];


            this.search = this.noDuplicateContacts[0];

            if(this.noDuplicateContacts.length>1){
              this.$refs['select_phone'].click();
            }
          }
          catch (ex){
            alert(ex.toString());
          }


      },
        goBack(){
            this.$store.dispatch('booking/resetState')
            this.$store.dispatch('order/resetState')
            this.$router.push({path: '/' })
        },
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            let charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode > 31 && (charCode != 46 &&(charCode < 48 || charCode > 57))){
                return false
            }
                return true;
        },
        onPaste: function (e){
          this.search = '';
          const clipboardData = (e.clipboardData || e.originalEvent.clipboardData || window.clipboardData).getData('text').replace(/\D/g,'');
          if(clipboardData.length>=10){
            this.search = `+7${clipboardData.substring(clipboardData.length-10)}`;
          }
        }
    },
    computed: {
      ...mapState('order', ['order']),
      isSupported(){
        return ('contacts' in navigator && 'ContactsManager' in window);
      },
      noDuplicateContacts(){
        return [...new Set(this.contacts)];
      },
      isValid(){
        return this.search.length&&!this.search.includes("_")
      }
    }
}
</script>
<style lang="scss" scoped>
$font-stack: 'Roboto', sans-serif;
    .order__wrapper{
        height: 100vh;
        background: #E5E5E5;
    }
    label{
        font-family: $font-stack;
        font-size: 14px;
        }
        .search__input{
            padding: 16px 12px;
          .phone_wrapper{
            position: relative;
            margin-top: 4px;
            img{
              position: absolute;
              right: 8px;
              top: 50%;
              transform: translateY(-50%);
            }
          }
          .another_phone {
            margin: 8px 0px;
            font-size: 14px;
            font-family: $font-stack;
          }
        }
        input[type="tel"] {
            border: 1px solid #9D9D9D;
            width: 100%;
            padding: 7px 10px;
            height: 40px;
            font-family: $font-stack;
            font-size: 14px;
    }
    .actions{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 16px;
      .order_yourself{
        display: flex;
        align-items: center;
        label{
          margin-left: 8px;
        }
      }
      .continue__btn{
        height: 30px;
        font-family: $font-stack;
        font-size: 14px;
        padding: 5px 7px;
        pointer-events: none;
        background: #9D9D9D;
        color: #000000;
      }
      .valid{
        background: #000000;
        color: #fff;
        pointer-events: all;
      }
    }
.client_select{
  margin-top: 4px;
  height: 30px;
  width: 100%;
  background: #fff;
}
</style>