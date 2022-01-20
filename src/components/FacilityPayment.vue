<template>
    <div class="facility__payment" @click="clicked = true">
        <div class="backdrop" v-show="clicked" @click.stop="closePopup"></div>
        <div class="flex">
            <div class="flex__key">Условия оплаты</div>
            <i class="fas fa-chevron-right"></i>
        </div>
        <div class="value">Предоплата: {{prepaid}} ₸</div>
        <edit-popup v-show="clicked" @close="closePopup">
            <template v-slot:title>
                <p class="facility__title">Условия оплаты</p>
            </template>
            <template v-slot:content>
                <div class="content">
                    <div class="content__inner">
                      <div class="oneTerm">
                        <p class="order_type">Разовая бронь</p>
                        <div class="dropdown__cancel">
                          <p class="cancel__title">Время отмены брони*</p>
                          <div class="dropdown">
                            <select ref="cancel_time_one">
                              <option value="0">В любое время</option>
                              <option value="3600">За 1 час</option>
                              <option value="2">За 2 часа</option>
                              <option value="4">За 4 часа</option>
                              <option value="6">За 6 часов</option>
                              <option value="8">За 8 часов</option>
                              <option value="10">За 10 часов</option>
                              <option value="12" selected>За 12 часов</option>
                              <option value="24">За 24 часа</option>
                              <option value="48">За 48 часов</option>
                            </select>
                          </div>
                        </div>
                        <p class="payment__title">Сумма предоплаты*</p>
                        <input type="text" name="prepaid" id="prepaid" placeholder="0 ₸" v-model="prepaid" @keypress.stop="isNumber($event)" inputmode="tel" class="input">
                        <p class="message_client">Сообщение клиенту</p>
                        <textarea id="message_one" name="message" v-model="message_one" class="textarea"/>
                      </div>
                      <div class="longTerm">
                        <p class="order_type">Долгосрочная бронь</p>
                        <div class="dropdown__cancel">
                          <p class="cancel__title">Время отмены брони*</p>
                          <div class="dropdown">
                            <select ref="cancel_time_long">
                              <option value="0">В любое время</option>
                              <option value="1">За 1 час</option>
                              <option value="2">За 2 часа</option>
                              <option value="4">За 4 часа</option>
                              <option value="6">За 6 часов</option>
                              <option value="8">За 8 часов</option>
                              <option value="10">За 10 часов</option>
                              <option value="12" selected>За 12 часов</option>
                              <option value="24">За 24 часа</option>
                              <option value="48">За 48 часов</option>
                            </select>
                          </div>
                        </div>
                        <p class="payment__title">Сумма залога*</p>
                        <input type="text" name="deposit" id="deposit" placeholder="0 ₸" v-model="deposit" @keypress.stop="isNumber($event)" inputmode="tel" class="input">
                        <p class="message_client">Сообщение клиенту</p>
                        <textarea id="message_long" name="message" v-model="message_long" class="textarea"/>
                      </div>
                    </div>
                </div>
            </template>
            <template v-slot:button>
                <div class="save__btn">
                    <div class="btn" :class="{'active': canSave}" @click.stop.prevent="setPrepaidCondition()">Применить</div>
                </div>
        </template>
        </edit-popup>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import EditPopup from './EditPopup.vue'
import axios from 'axios';
export default {
    components: {EditPopup},
    data(){
        return{
            clicked: false,
            prepaid: '',
            deposit: '',
            url: window.location.origin.replace('playfields.', ''),
            message_one:"Мы получили ваш запрос на бронирование площадки. Но еще НЕ ПОДТВЕРДИЛИ ЗАКАЗ. \n" +
                "\n" +
                "Для этого просим отправить предоплату в размере 30% от общей суммы аренды на номер Каспи +7 \n" +
                "\n" +
                " **обязательно укажите от кого",
            message_long: "Мы получили ваш запрос на бронирование площадки. Но еще НЕ ПОДТВЕРДИЛИ ЗАКАЗ.\n" +
                "\n" +
                "Для этого просим отправить залог в размере 100% суммы аренды одной брони на номер Каспи +7\n" +
                "\n" +
                " **обязательно укажите от кого"
        }
    },
    mounted(){
        this.setValues();
    },
    computed: {
      canSave(){
        return this.prepaid&&this.deposit;
      },
      ...mapState('facility', ['facility'])
    },
    methods: {
        closePopup(){
            this.clicked = false;
            this.setValues();
        },
        async setPrepaidCondition(){
            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${this.facility.id}/update-data`,
            {
              single_payment: {
                cancel_time: this.$refs['cancel_time_one'].value,
                prepaid: this.prepaid,
                message: this.message_one
              },
              multiple_payment: {
                cancel_time: this.$refs['cancel_time_long'].value,
                prepaid: this.deposit,
                message: this.message_long
              }
            }, 
            {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`
                }
            })
            .then(e=>this.$store.dispatch('facility/setFacilityPaymentCondition', {cancel_time: e.data.facility.cancel_time, prepaid: e.data.facility.prepaid}));
            this.clicked = false;
        },
        isNumber(evt){
            evt = (evt) ? evt : window.event;
            let charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)){
                evt.preventDefault();
            }
            else {
                return true;
            }   
        },
        setValues(){
            this.$refs['cancel_time_one'].value = this.facility.single_payment.cancel_time||'12';
            this.$refs['cancel_time_long'].value = this.facility.multiple_payment.cancel_time||'12';
            this.prepaid = this.facility.single_payment.prepaid||'0';
            this.deposit = this.facility.multiple_payment.prepaid||'0';
            this.message_long = this.facility.multiple_payment.message||this.message_long;
            this.message_one = this.facility.single_payment.message||this.message_one;
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
.facility{
    &__payment{
        background: #fff;
        box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
        max-height: 567px;
        .value{ 
            color: rgba(0, 0, 0, 0.6);
        }
      .oneTerm{
        padding-bottom: 16px;
      }
    }
    &__title{
        font-weight: 500;
        font-size: 20px;
        line-height: 32px;
    }
}
.flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    &__key{
        font-size: 16px;
    }
    i{
        color: rgba(0, 0, 0, 0.6);
    }
}
.content{
    padding: 16px;
    margin-bottom: 68px;
    &__inner{
        .input{
            width: 100%;
            height: 36px;
            padding: 8px;
            margin: 8px 0px;
            background: #F3F3F3;
            border: 1px solid #9D9D9D;
        }
      .order_type{
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.87);
        margin-bottom: 18px;

      }
      .textarea{
        height: 72px;
        width: 100%;
        background: #F3F3F3;
        border: 1px solid #9D9D9D;
        margin-top: 8px;
      }
        .dropdown__cancel{
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            select{
                border: none;
                outline: none;
            }
        }
    }
}
.save__btn{
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 16px;
    box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.1);
    .btn{
        padding: 8px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        background: rgba(0, 0, 0, 0.2);
        pointer-events: none;
        width: 100%;
        max-width: 343px;
        border-radius: 4px
    }
    .active{
        pointer-events: initial;
        background: #000;
    }
}
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 18;
}
</style>