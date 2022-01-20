<template>
    <div class="user__description" @click.stop="show = true">
        <div v-if="show" class="backdrop" @click.stop="show =false"></div>
        <div class="user__photo">
        <img :src="`${url}/storage/profile_original_avatars/${client.avatar}`" alt="" v-if="client.avatar!=='default_avatar.png'">
            <i class="fas fa-user-circle" v-else-if="client.avatar==='default_avatar.png'"></i>
        </div>
        <div class="user__info">
            <div class="user__name">
            {{client.firstname}}
        </div>
        <div class="user__company" v-if="company">
            {{company}}
        </div>
        </div>
        <client-card :client="client" v-if="show" :clicked="show" :hasMenu="hasMenu" :company="company"/>
    </div>
</template>
<script>
import ClientCard from './ClientCard.vue'
export default {
    props: ['client', 'hasMenu', 'company'],
    components: {
        ClientCard
    },
    data(){
        return{
            show: false,
            url: window.location.origin.replace('playfields.', '')
    }
    },
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
        img{
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