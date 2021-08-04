<template>
    <div class="edit__booking">
        <confirm-header>
            <template v-slot:main>
                <p class="order__id">Редактирование</p>
            </template>
            <template v-slot:date>
                <p class="order__date">Бронь, {{getDateFormat}}</p>
            </template>
        </confirm-header>
        <edit-card @hasChanged="hasChangedMethod"/>
        <div class="save">
            <div class="save__button" @click="hasChanged&&saveChanges()" :class="hasChanged?'changed':'notChanged'">Сохранить</div>
        </div>
    </div>
</template>
<script>
import ConfirmHeader from '../components/ConfirmHeader.vue'
import EditCard from '../components/EditCard.vue'
import {mapState} from 'vuex'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    data(){
        return{
            hasChanged: false
        }
    },
    components: {ConfirmHeader, EditCard},
    computed:{
        ...mapState('booking', ['date']),
        ...mapState('order', ['order']),
        getDateFormat(){
            return dayjs(this.date).locale('ru').format('DD MMMM')
        },
    },
    methods: {
        saveChanges(){
            console.log("AAAAA")
        },
        hasChangedMethod(value){
            this.hasChanged = value;
        }
    }
}
</script>
<style lang="scss" scoped>
.edit__booking{
    min-height: 100vh;
    background: #E5E5E5;
}
.save{
    padding: 0px 16px;
    position: absolute;
    width: 100%;
    bottom: 24px;
    &__button{
        height: 36px;
        border-radius: 4px;
        color: #FFFFFF;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        letter-spacing: 1.25px;
        text-transform: uppercase;
    }
    .changed{
        background: #03A9F4;
    }
    .notChanged{
        background: #9D9D9D;
        pointer-events: none;
    }

}
</style>