<template>
    <div class="user__description" @click.stop="showClientCard()">
        <div v-if="show" class="backdrop" @click.stop="closePopup"></div>
        <div class="user__photo">
        <img :src="order.client.photo" alt="" v-if="order.client.photo">
            <i class="fas fa-user-circle" v-else-if="!order.client.photo"></i>
        </div>
        <div class="user__info">
            <div class="user__name">
            {{order.client.client_name}}
        </div>
        <div class="user__company" v-if="order.client.company!=''">
            {{order.client.company}}
        </div>
        </div>
        <client-card :client="order.client" v-show="show" />
    </div>
</template>
<script>
import ClientCard from './ClientCard.vue'
export default {
    props: ['order'],
    components: {
        ClientCard
    },
    data(){return{
        show: false
    }
    },
    methods: {
        showClientCard(){
            this.show = true
        },
        closePopup(){
            this.show = false;
        }
    }
}
</script>
<style lang="scss" scoped>
.user{
    &__description{
        display: flex;
        align-items: center;
        background: rgba(0, 0, 0, 0.04);
    }
    &__photo{
        width: 20px;
        height: 100%;
        margin-right: 12px;
        margin-left: 9.67px;
        display: flex;
        justify-content: center;
        align-items: center;
        img, i{
            width: 100%;
            height: 20px;
            border-radius: 50%;
        }
    }
    &__info{
        margin-right: 8px;
    }
}
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
</style>