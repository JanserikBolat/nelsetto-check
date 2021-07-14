<template>
<div class="header">
    <div class="header__inner">
        <div class="header__top">
            <p class= "new__order">Новый заказ</p>
            <div class="close__order" @click="goBack()">
                <i class="fa fa-times-circle" aria-hidden="true"></i>
            </div>
    </div>
    <div class="header__bottom">
        <div class="radio__buttons">
            <input type = "radio" name="orderType" id="oneTime" checked @click="checkedTerm='one'">
            <label for="oneTime" class="oneTime__order">
                <span>Разовая бронь</span>
            </label>
            <input type = "radio" name="orderType" id="longTime" @click="checkedTerm='long'">
            <label for="longTime" class="longTime__order">
                <span>Долгосрочная бронь</span>
            </label>
        </div>
    </div>
</div>
<OneTermOrder v-if="checkedTerm==='one'" :date = this.date :time = this.time />
<LongTermOrder v-if="checkedTerm==='long'" :date = this.date :time = this.time />
<SearchUser/>
</div>
</template>
<script>
import SearchUser from '@/components/SearchUser'
import LongTermOrder from './LongTermOrder.vue'
import OneTermOrder from './OneTermOrder.vue'
export default{
    props: ['date', 'time'],
    components: {SearchUser, LongTermOrder, OneTermOrder},
    data(){
        return{
            checkedTerm: 'one'
        }
    },
    methods:{
        goBack(){
            this.$router.go(-1)
        }
    }
}
</script>
<style lang="sass" scoped>
$primary-color: #333
$font-stack: 'Roboto', sans-serif
body
    background-color: $primary-color
    margin: 0
    padding: 0
    box-sizing: border-box
.header
    width: 375px
    height: 115px
    background: #FFFFFF
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04)
.header__inner
    padding: 10px 12px 26px
    .header__top
        height: 32px
        display: flex
        justify-content: space-between
        align-items: center
        margin-bottom: 17px
        .new__order
            width: 123px
            height: 32px
            font-family: $font-stack
            font-weight: 500
            font-size: 20px
            line-height: 32px
        .close__order
            width: 24px
            height: 32px
            display: flex
            justify-content: center
            align-items: center
    .header__bottom
        .radio__buttons
            display: flex
            justify-content: flex-start
            align-items: center
            font-family: $font-stack
            font-style: normal
            font-weight: normal
            font-size: 14px
            line-height: 20px
            .oneTime__order
                width: 112px
                height: 30px
                padding: 5px 7px
                border: 1px solid black
                display: flex
                align-items: center
                justify-content: center
                span
                    font-family: $font-stack
                    font-size: 14px
                    line-height: 20px
                    text-align: center
            .longTime__order
                width: 152px
                height: 30px
                padding: 5px 7px
                border: 1px solid black
                display: flex
                align-items: center
                justify-content: center
                span
                    font-family: $font-stack
                    font-size: 14px
                    line-height: 20px
                    text-align: center

            input[type="radio"]
                display: none
            input[type="radio"]:checked + label
                    background: #18f19a
                    color: white

</style>