<template>
    <div class="userRegister__form">
        <div class="userRegister__inner">
            <div class="telephone__input">
                <div class="search__input">
                    <label  class="phone__label" for="phone">Номер телефона</label><br>
                        <input v-model="telephone" type="tel" id = "phone" name="phone"  title="Ваш телефонный номер"
                        disabled
                        v-mask="'+7 ### ### ## ##'"
                        >
                </div>
            </div>
            <div v-if="order.client.is_temporary" class="nameSurname__input">
                <div class="name__input">
                    <label  class="name__label" for="name">Имя</label><br>
                    <input v-model="name" type="text" id = "name" name="name"  title="Ваше имя">
                </div>
                <div class="surname__input">
                    <label  class="surname__label" for="surname">Фамилия</label><br>
                    <input v-model="surname" type="text" id = "surname" name="surname"  title="Ваша фамилия">
                </div>
            </div>
            <div v-if="!order.client.is_temporary" class="userInfo">
                <div class="userInfo__inner">
                    <div class="userInfo__info">
                        <div class="info__nameSurname">
                            {{order.client.firstname}} {{order.client.lastname?order.client.lastname:''}}
                        </div>
                      <div class="call" v-if="!is_crm">
                        <a :href="`tel:${telephone}`" class="callClient">Позвонить <span class="underline">{{telephone}}</span></a>
                      </div>
                        <div class="textWhatsapp" v-if="!is_crm">
                            <a :href="`https://api.whatsapp.com/send?phone=${telephone}`" target="_blank">Написать в <span class="underline">Whatsapp</span></a>
                        </div>
                    </div>
                    <div class="userInfo__photo">
                        <img :src="`${url}/storage/profile_avatars/${order.client.avatar}`" alt="">
                    </div>
                </div>
            </div>


            <div class="client__type" v-if="!is_crm">
                <div class="radio-buttons">
                    <div class="type__individual">
                        <label class="custom-radio">
                        <input type="radio" name="radio" checked @click="companyChecked=false"/>
                        <span class="radio-btn">
                            <p>Физ. лицо</p>
                        </span>
                      </label>
                    </div>
                    <div class="type__company">
                        <label class="custom-radio">
                        <input type="radio" name="radio" @click="companyChecked=true"/>
                        <span class="radio-btn">
                            <p>Юр. лицо</p>
                        </span>
                      </label>
                    </div>
                </div>
            </div>
            <div  v-if="companyChecked" class="company__input">
                <label  class="company__label" for="company">Компания</label><br>
                    <input v-model="company" type="text" id = "company" name="company"  title="Компания">
            </div>
            <div class="payload" v-if="!is_crm">
                <p>Способ оплаты</p>
                <div class="pay__cash">
                    <input type="radio" name="payload" title="Наличными" checked style="margin-right: 10px" @click="pay__type='cash'">
                    <label  class="cash">Наличными</label>
                </div>
                <div class="pay__card">
                    <input type="radio" name="payload" title="По реквизитам" style="margin-right: 10px" @click="pay__type='card'">
                    <label  class="card">По реквизитам</label>
                </div>
                
            </div>

            <order-info-before :orderYourself="is_crm" v-if="is_crm" />

            <div class="create__order" @click.stop="createOrder()" :class="{'canCreate':name.length&&surname.length}">
                Создать заказ
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import OrderInfoBefore from "./OrderInfoBefore.vue";
export default {
    props: ['is_crm'],
    data(){
        return{
            name: '',
            surname:'',
            telephone: '',
            companyChecked: false,
            company: '',
            pay__type: 'cash',
            userExists: false,
            url: window.location.origin.replace('playfields.', '')
        }
    }, 
    mounted(){
        this.name = this.order.client.firstname||'';
        this.surname = this.order.client.lastname||'';
        this.telephone = this.order.client.phone||'';
    },
  components: {OrderInfoBefore},
    methods:{
        createOrder: function(){
                this.$store.dispatch('order/setPayType', this.pay__type)
                if(this.companyChecked){
                    this.$store.dispatch('order/setCompany', this.company)
                }
                if(this.order.client.is_temporary){
                    this.$store.dispatch('order/setClient', {...this.order.client, firstname: this.name, lastname: this.surname})
                }
                this.$emit('createOrder');
        }
    },
    computed: {...mapState('order', ['order'])}
}
</script>
<style lang="scss" scoped>
$font-stack: 'Roboto', sans-serif;
.userRegister__form{
    background: #E5E5E5;
    min-height: 100vh;
}
.telephone__input,.nameSurname__input, .client__type, .company__input, .payload{
    padding: 16px;
}
label{
    font-family: $font-stack;
    font-size: 14px;
    }
    .search__input{
        input {
            border: none;
            width: 100%;
            padding-left: 20px;
            font-family: $font-stack;
            font-size: 14px;
            height: 36px;
            color: #9D9D9D;
            background: #E7E7E7;
        }
    }
    .nameSurname__input{
        display: flex;
        justify-content: space-between;
        gap: 16px;
        label{
            margin-bottom: 4px;
        }
    }
    .name__input, .surname__input{
        input{
            width: 100%;
            height: 36px;
            padding: 8px;
            font-family: $font-stack;
            font-size: 14px;
            line-height: 20px;
            background: #FFFFFF;
            border: 1px solid #9D9D9D;
        }
    }
    .custom-radio input {
        display: none;
      }
      .radio-buttons{
          display: flex;
          height: 40px;
          background: white;
          padding: 8px;
      }
      .type__individual, .type__company{
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          label{
              width: 100%;
              height: 100%;
          }
      }
      .radio-btn{
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
      }
      .custom-radio input:checked + .radio-btn {
        background: #E2E2E2;
        border-radius: 4px;
      }
      .company__input>input{
          width: 100%;
      }
    .payload>p, .create__order{
        font-family: $font-stack;
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
    }
    .create__order{
        width: 110px;
        padding: 5px 7px;
        font-weight: 400;
        margin-left: 16px;
        background: #9D9D9D;;
        pointer-events: none;
        margin-top: 16px;
    }
    .canCreate{
        background: #000;
        color: white;
        pointer-events: inherit;
    }

    .userInfo{
        height: 78px;
        margin-bottom: 24px;
        &__inner{
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
            padding: 13px 6px 8px 16px;
            .info__nameSurname{
                font-weight: 500;
                font-size: 20px;
                line-height: 32px;
                font-family: $font-stack;
            }
            .callClient, .textWhatsapp{
                font-size: 14px;
                line-height: 20px;
                font-family: $font-stack;
                text-decoration: none;
                color: #000;
                .underline{
                    text-decoration: underline;
                }
                a{
                    text-decoration: none;
                    color: #000;
                }
            }
            .callClient{
                margin: 2px 0px;
            }
        }
    }
    .userInfo__photo{
        width: 64px;
        height: 64px;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
</style>