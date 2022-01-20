<template>
    <div class="confirmation__card">
        <div class="confirmation__inner">
            <div v-if="!fromNelsette" class="ordinary__user">
                <p style="font-weight: 500; margin-bottom: 16px">Подтверждение заказа</p>
                <p class="confirmation__text" style="margin-bottom: 16px">
                    На номер телефон клиента был отправлен код, для подтверждения заказа попросите назвать его вам.
                </p>
                <div class="client_interaction">
                  <div class="call"><a :href="`tel:${order.client.phone}`">Позвонить</a></div>
                  <div class="text"><a :href="`https://api.whatsapp.com/send?phone=${order.client.phone}`" target="_blank">Написать в WhatsApp</a></div>
                </div>
                <div class="confirmation__code">
                    <input maxlength="1" type="text"  @keyup="handleClick('','one', 'two')" inputmode="tel" ref="one">
                    <input maxlength="1" type="text"  @keyup="handleClick('one', 'two', 'three')" inputmode="tel" ref="two" >
                    <input maxlength="1" type="text"  @keyup="handleClick('two','three', 'four')" inputmode="tel" ref="three">
                    <input maxlength="1" type="text"  @keyup="handleClick('three', 'four', 'five')" inputmode="tel" ref="four" >
                    <input maxlength="1" type="text"  @keyup="handleClick('four', 'five', '')" inputmode="tel" ref="five" >
                </div>
                <div class="sendConfirmation" @click="sendOrder()" :class="{'enabled': code.length===5}">
                    Отправить
                </div>
                 <div class="sendConfirmation__again" style="margin-top: 8px;" v-if="clicked">
                    <p v-if="!timeOut">Отправить код повторно ({{getTime}})</p>
                    <p v-if="timeOut" @click.stop="resendCode()">Отправить повторно</p>
                </div>
            </div>
            <div  v-else-if="fromNelsette" class="nelsette__user">
                <p style="margin-bottom: 16px">Ожидание подтверждения заказа</p>
                <p>{{order.client.firstname}} {{order.client.lastname}} должен подтвердить заказ зайдя в приложение</p>
            </div>
        </div>
    </div>    
</template>
<script>
import axios from 'axios';
import {mapGetters, mapState} from 'vuex'
export default {
    props: ['fromNelsette'],
    data(){
        return{
            code: '',
            clicked: false,
            timeOut: false,
            seconds: 60,
            url: window.location.origin.replace('playfields.', '')
        }
    },
    methods: {
        handleClick(prev, itself, next){
            if(this.$refs[itself].value.length){
                if(next!=''){
                    this.$refs[next].focus();
                }
                else{
                    this.$refs[itself].blur();
                }
            }
            else{
                if(prev!=''){
                    this.$refs[prev].focus()
                }
            }

            this.code = this.$refs['one'].value+this.$refs['two'].value+this.$refs['three'].value+this.$refs['four'].value+this.$refs['five'].value;
        },
        countDown(){
            const countdown = setInterval(()=>{
                if(this.seconds>=1){
                    this.seconds-=1
                }
                else{
                    this.timeOut = true;
                    this.seconds = 60;
                    clearInterval(countdown)
                }
            }, 1000)
        },
        async resendCode(){
            this.timeOut = false;
            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/order/${this.order.id}/resend-code`, {
                client_id: this.order.client.id,
                code: this.code
            },
            {headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}}).then(()=>{
                this.countDown();
            })
        },
        async sendOrder(){
            this.clicked = true;
            this.countDown();
            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/order/${this.order.id}/accept`, {
                client_id: this.order.client.id,
                code: this.code
            },
            {headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}}).then((res)=>{
                if(res.status===200){
                    window.location.reload();
                }
            }).catch(e=>{
                e.response.data.error
            })
        },
    },
    computed: {
        ...mapGetters('order', ['getOrder']),
        ...mapGetters('booking', ['getBooking']),
        ...mapState('order', ['order']),
        getTime(){
            return `${Math.floor(this.seconds/60)}`.padStart(2,'0')+':'+`${this.seconds%60}`.padStart(2,'0')
        }
    }
}
</script>
<style lang="scss" scoped>
*{
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    outline: none;
    border: none;
}
.confirmation__card{
    padding: 8px 16px;
    background: #FDFF97;
    margin: 16px 0px;
}
.client_interaction{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  a{
    text-decoration: none;
    color: #53D37E;
    font-weight: 500;
    text-transform: uppercase;
  }
}
.confirmation__code{
    display: flex;
    input{
        width: 34px;
        height: 40px;
        background: #BEBEBE;
        margin-right: 36px;
        font-size: 24px;
        text-align: center;
    }
}
.sendConfirmation{
    padding: 5px 7px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
    width: 85px;
    pointer-events: none;
    background: #9D9D9D;
    color: #fff;
}
.enabled{
    background: #000;
    pointer-events: inherit;
}
.sendAgain{
    background: #000;
    color: #fff;
    padding: 4px 8px;
}
</style>