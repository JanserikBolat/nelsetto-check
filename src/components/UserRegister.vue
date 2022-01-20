<template>
<div class="registration__from">
    <div class="form">
        <div class="telephone__number">
            <label for="telephone__number">Номер телефона</label><br>
            <div class="telephone__input">
              <p class="tel__code">+7</p>
              <input name="telephone__number" v-model="tel" type="tel"
              @change="formatTelephoneNumber"
              placeholder="XXXXXXXXXX"
              :class="$v.tel.$error?'invalid':''"
              maxlength="10"
            >
            </div>
        </div>
      <div class="firstName">
        <label for="firstName">Имя</label><br>
        <input name="firstName" v-model="firstName" placeholder="Ваше Имя" type="text"
        :class="$v.firstName.$error?'invalid':''"
        >
      </div>
      <div class="lastName">
        <label for="lastName">Фамилия</label><br>
        <input name="lastName" v-model="lastName" placeholder="Ваша Фамилия"
        :class="$v.lastName.$error?'invalid':''"
        >
      </div>
      <button class="send__order" @click="openPopup">Отправить заказ</button>
    </div>
    <Popup
    :is-open="isPopupOpen"
    @ok="popupConfirmed"
    @close="isPopupOpen = false"
  >
    4-х значный код был отправлен на номер заказчика.<br> Пожалуйста, напишите код здесь
    <template #actions="{ confirm }">
      <input placeholder = "ХХХХ" v-model="confirmation" />
      &nbsp;
      <button @click="confirm" :disabled="!isConfirmationCorrect">OK</button>
    </template>
</Popup>
</div>
</template>
<script>
import Popup from "@/components/Popup.vue";
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
    props: ['telephoneNumber'],
    components: {Popup},
    data(){
        return{
            lastName: "",
            firstName: "",
            tel: this.telephoneNumber,
            isPopupOpen: false, 
            confirmation: ""
        }
    },
    validations:{
        lastName: {
          required,
          minLength: minLength(1)
        },
        firstName: {
          required,
          minLength: minLength(1)
        },
        tel: {
          required,
          minLength: minLength(10),
          maxLength: maxLength(10)
        }
    },
    CONFIRMATION_CODE: "5555",
    computed: {
        isConfirmationCorrect() {
          return this.confirmation.length===4 //=== this.$options.CONFIRMATION_CODE;
        },
    },
    methods: {
    openPopup() {
        if(this.$v.$invalid){
          this.$v.$touch()
          return
        }
          else{
            this.confirmation = "";
            this.isPopupOpen = true;
      }
    },

    popupConfirmed() {
      this.$router.push({path: '/'})
      this.isPopupOpen = false;
    },
    formatTelephoneNumber(){
      console.log(this.tel)
    }
  },
}
</script>
<style lang="sass" scoped>
$font-stack: 14px 'Roboto', sans-serif 
p
  font: $font-stack
  line-height: 20px
.registration__from
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    box-shadow: 0px 4px 8px rgb(0 0 0 / 4%), 0px 0px 2px rgb(0 0 0 / 6%), 0px 0px 1px rgb(0 0 0 / 4%)
    .form
        height: 294px
        .telephone__input
          position: relative
          padding-left: 20px
        label
            font: $font-stack
            line-height: 20px
            margin-bottom: 4px
        .firstName, .telephone__number
            padding-bottom: 24px
        .lastName
            padding-bottom: 29px
.tel__code
  position: absolute
  top: -10px
  height: 100%
  left: 2px
  width: 20px
  font: $font-stack
input 
  border-top-style: hidden
  border-right-style: hidden
  border-left-style: hidden
  border-bottom-style: groove
  border-color: #E5E5E5
  width: 100%
  font-family: $font-stack
  font-size: 14px
.invalid
  border-color: red

</style>
