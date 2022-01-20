<template>
    <div class="edit__booking">
        <confirm-header @back="back">
            <template v-slot:main>
                <p class="order__id">Редактирование</p>
            </template>
            <template v-slot:date>
                <p class="order__date">Бронь, {{getDateFormat}}</p>
            </template>
        </confirm-header>
        <edit-card/>
    </div>
</template>
<script>
import ConfirmHeader from '../components/ConfirmHeader.vue'
import EditCard from '../components/EditCard.vue'
import {mapState} from 'vuex'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    components: {ConfirmHeader, EditCard},
    methods: {
        back(){
            this.$router.push({path: '/'});
        }
    },
    mounted(){
        window.scrollTo(0,0)
    },
    computed:{
        ...mapState('booking', ['booking']),
        getDateFormat(){
            return dayjs(this.booking.date).locale('ru').format('DD MMMM')
        },
    },
}
</script>
<style lang="scss" scoped>
.edit__booking{
    min-height: 100vh;
    background: #E5E5E5;
}
</style>