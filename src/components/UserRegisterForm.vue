<template>
    <div class="userRegister__form">
        <div class="userRegister__inner">
            <div class="telephone__input">
                <div class="search__input">
                    <label  class="phone__label" for="phone">Номер телефона</label><br>
                    <div class="search__wrapper">
                        <p class="tel__code">+7</p>
                        <input v-model="tel" type="tel" id = "phone" name="phone"  title="Ваш телефонный номер"
                        disabled
                        >
                    </div>
                </div>
            </div>
            <div v-if="!userExists" class="nameSurname__input">
                <div class="name__input">
                    <label  class="name__label" for="name">Имя</label><br>
                    <input v-model="name" type="text" id = "name" name="name"  title="Ваше имя">
                </div>
                <div class="surname__input">
                    <label  class="surname__label" for="surname">Фамилия</label><br>
                    <input v-model="surname" type="text" id = "surname" name="surname"  title="Ваша фамилия">
                </div>
            </div>
            <div v-if="userExists" class="userInfo">
                <div class="userInfo__inner">
                    <div class="userInfo__info">
                        <div class="info__nameSurname">
                            {{name}} {{surname}}
                        </div>
                        <div class="textWhatsapp">
                            Написать в Whatsapp
                        </div>
                    </div>
                    <div class="userInfo__photo">
                        <img :src="photo" alt="">
                    </div>
                </div>
            </div>
            <div class="client__type">
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
            <div class="payload">
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
            <div class="create__order" @click="createOrder">
                Создать заказ
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['tel'],
    created(){
        this.findUser();
    },
    data(){
        return{
            name: '',
            surname:'',
            telephone: `8${this.tel}`,
            companyChecked: false,
            company: '',
            pay__type: 'cash',
            userExists: false,
            photo: '',
        }
    }, 
    methods:{
        findUser: function(){
            let users = JSON.parse(localStorage.getItem('users'));
            for(const user in users){
                if(users[user].client_tel===this.telephone){
                    console.log("A")
                    this.name = users[user].client_name
                    this.surname = users[user].client_surname
                    this.photo = users[user].client_photo
                    this.userExists=true
                    break;
                }
            }
        },
        createOrder: function(){
            this.$store.dispatch('order/setPayType', this.pay__type)
            this.$store.dispatch('order/setClient', {client_name: this.name, client_surname: this.surname, client_tel: this.telephone, company: this.company})
            this.$emit('createOrder', this.userExists);
        }
    }
}
</script>
<style lang="scss" scoped>
$font-stack: 'Roboto', sans-serif;
.userRegister__form{
    background: #E5E5E5;
    min-height: 100vh;
    padding: 16px;
}
.telephone__input, .nameSurname__input, .client__type, .company__input, .payload{
    margin-bottom: 16px;
}
label{
        font-family: $font-stack;
        font-size: 14px;
        }
    .search__wrapper{
        position: relative;
        height: 25px;
        p{
            position: absolute;
            height: 100%;
            left: 2px;
            width: 20px;
            font-family: $font-stack;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9D9D9D;
        }
        input {
            border-top-style: hidden;
            border-right-style: hidden;
            border-left-style: hidden;
            border-bottom-style: groove;
            border-color: #E5E5E5;
            width: 100%;
            padding-left: 20px;
            font-family: $font-stack;
            font-size: 14px;
            height: 25px;
            color: #9D9D9D;
        }
    }
    .nameSurname__input{
        display: flex;
        justify-content: space-between;
        label{
            margin-bottom: 4px;
        }
    }
    .name__input, .surname__input{
        width: 100%;
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
        width: 109px;
        padding: 5px 7px;
        background: #000;
        color: white;
        font-weight: 400;
    }

    .userInfo{
        height: 78px;
        padding: 13px 6px 8px 16px;
        &__inner{
            display: flex;
            justify-content: space-between;
            align-items: center;
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