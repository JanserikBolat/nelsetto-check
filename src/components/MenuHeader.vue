<template>
    <div class="menu__header">
        <div class="back__btn" v-show="backButton" @click="handleClick()">
            <i class="fas fa-arrow-left"></i>
        </div>
        <slot name="title"></slot>
        <slot name="logout" v-show="logout"></slot>
    </div>
</template>
<script>
export default {
    props:['backButton', 'logout'],
    methods: {
        handleClick(){
            this.$emit('back');
        }
    }
}
</script>
<style lang="scss" scoped>
.menu__header{
    padding: 9px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: #fff;
    box-shadow: 0px 0.5px 0px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(20px);
    margin-bottom: 16px;
    .back__btn{
        position: absolute;
        left: 20px;
        i{
            color: #03A9F4;
            font-size: 16px;
        }
    }
}
</style>