<template>
    <div class="client" @click.stop="showClientCard">
        <div class="backdrop" v-show="show" @click.stop="show = false"></div>
        <div class="client__inner">
            <div class="client__left">
                <div class="avatar">
                    <img :src="`${url}/storage/profile_avatars/${client.avatar}`" alt="Photo" v-if="client.avatar!=='default_avatar.png'">
                    <i  v-else class="fas fa-user-circle"></i>
                </div>
                <div class="info">
                    <p class="name">{{client.firstname}} {{client.lastname}}</p>
                    <p class="phone">{{client.phone}}</p>
                    <p class="bookings_count" v-if="filter===0&&client.bookings_count>0">Брони: {{client.bookings_count}}</p>
                    <p class="client_debt" v-if="filter===1&&client.debts.client>0">{{client.debts.client}} ₸</p>
                    <p class="admin_debt" v-if="filter===2&&client.debts.admin<0">{{client.debts.admin}} ₸</p>
                    <p class="deposits" v-if="filter===3&&parseInt(client.deposits)>0">{{client.deposits}} ₸</p>
                </div>
            </div>
            <div class="client__right">
                <div class="whatsapp" @click.stop="show=false">
                    <a :href="`https://api.whatsapp.com/send?phone=${client.phone}`" target="_blank"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>
        </div>
        <client-card :client="client" :clicked="show" v-if="show"/>
    </div>
</template>
<script>
import ClientCard from './ClientCard.vue'
export default {
    props: ['client', 'filter'],
    data(){
        return{
            show: false,
            url: window.location.origin.replace('playfields.', '')
        }
    },
    components: {
        ClientCard
    },
    methods: {
        showClientCard(){
            this.show = true;
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
.client{
    background: #FFFFFF;
    box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.05);
    padding: 16px;
    &__inner{
        display: flex;
        justify-content: space-between;
    }
    &__left{
        display: flex;
        .avatar{
            border-radius: 50%;
            overflow: hidden;
            width: 40px;
            height: 40px;
            margin-right: 8px;
            img{
                width: 100%;
                height: 100%;
            }
            i{
                font-size: 40px;
            }
        }
        .info{
            .phone{
                font-size: 12px;
                line-height: 14px;
                color: rgba(0, 0, 0, 0.54);
                margin-bottom: 4px;
                margin-top: 4px;
            }
          .bookings_count, .client_debt, .admin_debt, .deposits{
            font-size: 12px;
            line-height: 14px;
            font-weight: 500;
          }
            .bookings_count{
              color: rgba(0, 0, 0 , 0.87);
            }
            .client_debt{
              color: #FF5252;
            }
            .admin_debt{
              color: #FFD600;
            }
            .deposits{
              color: #000;
            }
        }
    }
    &__right{
        .whatsapp{
            background: linear-gradient(0deg, #25CF43 0%, #61FD7D 100%);
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
            a{
                text-decoration: none;
                color: #fff;
            }
        }
    }
}
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10;
}
</style>