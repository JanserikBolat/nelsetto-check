<template>
    <div class="popup">
        <div class="popup__inner">
        <div class="popup__order">
            <div class="new__order__wrapper">
                <p class="new__order">Новый заказ</p>
            </div>
            <div class="order__duration__wrapper">
                <p class="order__duration">{{getDuration(orderInfo.duration, orderInfo.durationRange)}}</p>
            </div>
            <div class="close__popup" @click="closePopup">
                <div class="close__button"></div>
            </div>
        </div>
        <div class="popup__orderDescription">
            <div class="order__desription">
                <p class="order__date">{{orderInfo.date}}</p>
                <p class="order__time">{{orderInfo.startTime}}:{{orderInfo.endTime}}</p>
            </div>
            <div class="continue__order">
                <button class="continue__button" @click="continueOrder()">Продолжить</button>
            </div>
        </div>
        </div>
    </div>
</template>
<script>
export default({
    props: ['orderInfo'],
    mounted(){
        console.log(this.orderInfo)
    },
    methods: {
       closePopup(){
           this.$emit('closePopup')
       },
       getDuration(duration, durationRange){
           const totalMinutes = duration*durationRange
           const hours = Math.floor(totalMinutes/60)
           const minutes = totalMinutes%60
           return `${hours} ч ${minutes} мин`
       },
       continueOrder(){
           this.$router.push({name: 'order', params: {date: this.orderInfo.date, time: `${this.orderInfo.startTime}-${this.orderInfo.endTime}`}})
       }
   }
})
</script>
<style lang = "sass" scoped>
.popup
    position: fixed
    width: 100%
    bottom: 0
    left: 0
    right: 0
    height: 120px
    background: #fff
    box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04)
    z-index: 15
    .popup__inner
        margin: 10px 16px 22px
        position: relative
        .popup__order
            display: flex
            .new__order__wrapper
                width: 123px
                height: 32px
                .new__order
                    margin: 0
                    font-family: 'Roboto', sans-serif
                    font-style: normal
                    font-weight: 500
                    font-size: 20px
                    line-height: 32px
                    color: #000

            .order__duration__wrapper
                width: fit-content
                height: 32px
                margin-left: 12px
                opacity: 0.5
                .order__duration
                    margin: 0
                    font-family: 'Roboto', sans-serif
                    font-style: normal
                    font-weight: 500
                    font-size: 20px
                    line-height: 32px
                    color: #000

            .close__popup
                position: absolute
                width: 24px
                height: 32px
                right: 0
                top: 0
                display: flex
                justify-content: center
                align-items: center
                .close__button
                    width: 20px
                    height: 20px
                    background: #000
                    border-radius: 50%
                    display: flex
                    justify-content: center
                    align-items: center
                .close__button::before, .close__button::after
                    content: ''
                    position: absolute
                    background: #fff
                    width: 2px
                    height: 15px
                .close__button::after
                    transform: rotate(45deg)
                .close__button::before
                    transform: rotate(-45deg)
        .popup__orderDescription
            display: flex
            flex-direction: row
            align-items: flex-start
            margin-top: 16px
            .order__date, .order__time
                margin: 0
                font-family: Roboto
                font-style: normal
                font-weight: normal
                font-size: 14px
                line-height: 20px
                color: #000000
            .order__date
                height: 20px
            .order__time
                width: 81px
                height: 20px
        .continue__button
            background: #FFFFFF
            border: 1px solid #9D9D9D
            padding: 5px 7px
            margin-left: 31px
            margin-top: 10px
</style>
