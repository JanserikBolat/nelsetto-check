<template>
    <div class="clients__wrapper">
        <ClientCardMini v-for="client in clients" :key="client.client_tel"/>
    </div>
</template>
<script>
import ClientCardMini from '../components/ClientCardMini.vue'
export default {
    components: {ClientCardMini},
    data(){
        return{
            clients: []
        }
    },
    created(){
        this.clients = JSON.parse(localStorage.getItem('users'))
    }
}
</script>
<style lang="scss" scoped>

</style>