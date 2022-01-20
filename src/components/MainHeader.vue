<template>
    <div class = "mainHeader">
        <div class="mainHeader__inner">
            <div class="mainHeader__top">
                <slot name="title" v-if="!filterType" />
                <div class="mainHeader__filters" v-if="filterType">
                    <div @click ='setFilter("oneDay")' class="filter__day" :class="active==='oneDay'?'active':''">
                        <p>День</p>
                    </div>
                    <div @click ='setFilter("allTime")' class="filter__allTime" :class="active==='allTime'?'active':''">
                        <p>Все время</p>
                    </div>
                </div>
                <div class="dropdown">
                    <DropDown  :options="options" :id="'facility'" :initialValue="initial" @selected="selected" v-if="options.length>1"/>
                    <div class="notification" @click.stop="goToNotifications">
                        <div class="amount" v-if="count">{{count}}</div>
                        <img src="/img/notification.svg" alt="Уведомления">
                </div>
                </div>
            </div>
            <div class="mainHeader__bottom">
                <div class="number">
                    <input v-model="telephone" type="tel" id = "phone" name="phone"  title="+7" v-mask="'+7 ### ### ## ##'" placeholder="+7">
                </div>
                <a class="button" :href="`https://wa.me/${telephone.split(' ').join('')}?text=${url}/fc/${facility.id}`" target="_blank">
                    Отправить по WhatsApp
                </a>
            </div>
        </div>
    </div>
</template>
<script>
import DropDown from './DropDown.vue'
import {mapState} from 'vuex'
import axios from "axios";
export default {
    props: ['filterType'],
    components: {
        DropDown
    },
    data(){
        return{
            active: this.filterType, 
            options:[],
            initial: {},
            telephone: '',
            f_id: sessionStorage.getItem(''),
            url: window.location.origin.replace('playfields.', ''),
            count: 0
        }
    },
    async created(){
        this.options = JSON.parse(sessionStorage.getItem('facilities'))
        this.initial = this.options.find(e=>e.value==sessionStorage.getItem('active_facility'))||this.options[0];

      axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/notifications-unread`, {
        headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
      }).then((res)=>this.count = res.data.count);
    },
    methods: {
        setFilter(filter){
            this.active = filter
            if(this.active==='oneDay'){
                this.$router.push({path: '/'})
            }
            else if(this.active==='allTime'){
                this.$router.push({name: 'main'})
            }
        },
        selected(value, id){
            if(id==='facility'){
                this.$emit('changed', value.value);
            } 
        },
      goToNotifications(){
          this.$router.push({name: 'notifications'});
      }
    },
    computed: {
        ...mapState('facility', ['facility'])
    }
}
</script>
<style lang="scss" scoped>
*{
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: #000000;
}
.mainHeader{
    position: fixed;
    z-index: 16;
    top: 0;
    left: 0;
    right: 0;
    background: #FFFFFF;
    box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.05);
    &__inner{
        padding: 12px 16px;
    }
    &__top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .dropdown{
            max-width: 175px;
            height: 30px;
            display: flex;
            .notification{
                margin-left: 8px;
                position: relative;
                .amount{
                  position: absolute;
                  z-index: 2;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  top: -4px;
                  right: -4px;
                  background: #EB6F62;
                  color: #fff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
            }
        }
        .title{
            font-weight: 500;
            font-size: 20px;
            line-height: 32px;
        }
    }
    &__bottom{
        margin-top: 12px;
        display: flex;
        width: 100%;
        .number, .button{
            width: 50%;
            height: 30px;
            background: #FFFFFF;
            border: 1px solid #9D9D9D;
        }
        .number{
            input{
                outline: none;
                border: none;
                width: 100%;
                height: 100%;
                text-align: left;
                padding: 5px 8px;
            }
        }
        .button{
            display: flex;
            justify-content: center;
            align-items: center;
            border-left: none;
        }
    }
    &__filters{
        display: flex;
        justify-content: space-between;
        margin-right: 10px;
    }
}
.filter{
    &__day{
        width: 48px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0.5px solid black;
        margin-right: 4px;
        cursor: pointer;
    }
    &__allTime{
        width: 83px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0.5px solid black;
        cursor: pointer;
    }
}
.active{
    background: #A9A9A9;
}
</style>
