<template>
    <div class="facility__contacts" @click="clicked = true">
        <div class="backdrop" v-show="clicked" @click.stop="closePopup"></div>
        <div class="flex">
            <div class="flex__key">Контакты</div>
            <i class="fas fa-chevron-right"></i>
        </div>
        <div class="value"></div>
        <edit-popup v-show="clicked" @close="closePopup">
            <template v-slot:title>
                <p class="facility__title">Контакты</p>
            </template>
            <template v-slot:content>
                <div class="content">
                    <div class="content__inner">
                        <div class="phone__numbers">
                            <p class="phone__number">Номер телефона*</p>
                            <div class="tel1">
                                <input @keypress.stop="isNumber($event)" @keyup.stop="isValid(tel1)" type="tel" name="main" id="main" v-mask="'+7 ### ### ## ##'" placeholder="Введите номер телефона" v-model="tel1">
                                <p class="error__format" v-show="!isValid(tel1)">Неверный формат номера</p>
                            </div>
                            <div class="tel2">
                                <input @keypress.stop="isNumber($event)" @keyup.stop="isValid(tel2)" type="tel" name="additional_1" id="additional_1" v-mask="'+7 ### ### ## ##'" v-show="additional>=1" placeholder="Введите номер телефона" v-model="tel2">
                                <p class="error__format" v-show="!isValid(tel2)">Неверный формат номера</p>
                            </div>  
                            <div class="tel3">
                                <input @keypress.stop="isNumber($event)" @keyup.stop="isValid(tel3)" type="tel" name="additional_2" id="additional_2" v-mask="'+7 ### ### ## ##'" v-show="additional>=2" placeholder="Введите номер телефона" v-model="tel3">
                                <p class="error__format" v-show="!isValid(tel3)">Неверный формат номера</p>
                            </div>
                            <div class="add__phone">
                                <i class="fas fa-plus" @click="additional+=1" :class="{'not_available': additional>=2}"></i>
                                <div class="add__btn" @click="additional+=1" :class="{'not_available': additional>=2}">Добавить еще один номер телефона</div>
                            </div>
                        </div>
                        <div class="whatsapp">
                            <label for="whatsapp">Whatsapp</label>
                            <input @keypress.stop="isNumber($event)" @keyup.stop="isValid(whatsapp)" type="tel" name="whatsapp" id="whatsapp" v-mask="'+7 ### ### ## ##'" placeholder="Введите номер привязанный к Whatsapp" v-model="whatsapp">
                            <p class="error__format" v-show="!isValid(whatsapp)">Неверный формат номера</p>
                        </div>
                        <div class="instagram">
                            <label for="instagram">Instagram</label>
                            <input type="text" name="instagram" id="instagram" placeholder="instagram.com/" v-model="instagram">
                        </div>
                        <div class="website">
                            <label for="website">Веб-сайт</label>
                            <input type="text" name="website" id="website" placeholder="Введите адрес веб-сайта" v-model="website">
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:button>
                <div class="save__btn">
                    <div class="btn" :class="{'active':(tel1.length||tel2.length||tel3.length)&&valid}" @click.stop="setPhone()">Сохранить</div>
                </div>
            </template>
        </edit-popup>
    </div>
</template>
<script>
import EditPopup from './EditPopup.vue'
import {mapState} from 'vuex';
import axios from 'axios'
export default {
    data(){
        return{
            clicked: false,
            additional: 0,
            phone_numbers:[],
            tel1: '',
            tel2: '',
            tel3: '',
            whatsapp: '',
            instagram: '',
            website: '',
            url: window.location.origin.replace('playfields.', '')
        }
    },
    created(){
        this.setValues();
    },
    methods: {
        setValues(){
            this.tel1 = this.facility.contacts.phones['tel1']?this.facility.contacts.phones['tel1']:"";
            this.tel2 = this.facility.contacts.phones['tel2']?this.facility.contacts.phones['tel2']:"";
            this.tel3 = this.facility.contacts.phones['tel3']?this.facility.contacts.phones['tel3']:"";
            this.whatsapp = this.facility.contacts.socials['whatsapp']?this.facility.contacts.socials['whatsapp']:"";
            this.instagram = this.facility.contacts.socials['instagram']?this.facility.contacts.socials['instagram']:"";
            this.website = this.facility.contacts.socials['website']?this.facility.contacts.socials['website']:"";
        },
        closePopup(){
            this.clicked = false;
            this.setValues();
        },
        async setPhone(){
            this.phone_numbers = [this.tel1, this.tel2, this.tel3].map(e=>e.split(" ").join('')).filter(e=>!e.includes('_'));
            const sendData = {socials: {"instagram":this.instagram, "website": this.website, "whatsapp": this.whatsapp}};        
            this.phone_numbers.map((e, i)=>{
                sendData['phones'] = {...sendData['phones'], [`tel${i+1}`]:e};
            })

            

            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${this.facility.id}/update-data`,
                {contacts: sendData},
                {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
                })
            .then(e=>{this.$store.dispatch('facility/setFacilityContacts', e.data.facility.contacts)}).catch(e=>console.log(e));
            this.clicked = false;
        },
          isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            let charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)){
                evt.preventDefault();
            }
            else {
                return true;
            }
        },
        isValid(tel){
            return tel.split(' ').length&&!tel.includes("_")
        }
    },
    components: {EditPopup},
    computed: {...mapState('facility', ['facility']),
        valid(){
            return [this.tel1, this.tel2, this.tel3, this.whatsapp].filter(e=>e.includes('_')).length===0;
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
    &__contacts{
        padding: 16px;
        background: #fff;
        box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
        max-height: 567px;
        .value{ 
            color: rgba(0, 0, 0, 0.6);
            word-break: break-all;
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
}
.phone__numbers{
    .phone__number{
        margin-bottom: 8px;
    }
    input[type="tel"]{
        margin-bottom: 8px;
        width: 100%;
        max-width: 343px;
        height: 36px;
        padding: 8px;
    }
    .add__phone{
        color: #000;
        display: flex;
        align-items: center;
        .add__btn{
          margin-left: 8px;
        }
        .not_available{
            color: rgba(0, 0, 0, 0.38);
            pointer-events: none;
        }
    }
    p.error__format{
        color: red;
        font-size: 10px;
    }
}
.whatsapp, .instagram, .website{
        display: flex;
        flex-direction: column;
        margin-top: 16px;
        input[type="text"], input[type="tel"]{
            width: 100%;
            max-width: 343px;
            height: 36px;
            padding: 8px;
        }
    p.error__format{
        color: red;
        font-size: 10px;
    }
}
.save__btn{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    .btn{
        padding: 8px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        background: rgba(0, 0, 0, 0.2);
        pointer-events: none;
        max-width: 100%;
        width: 343px;
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