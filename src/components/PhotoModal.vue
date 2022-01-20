<template>
    <div class="modal">
        <div class="modal__inner">
            <div class="modal__options">
                <div class="option choose__photo" @click="changePhoto">Выбрать фото</div>
                <div v-show="needed" class="option open__photo" @click="showPhoto">Посмотреть фото</div>
                <div v-show="needed" class="option delete__photo" @click="deletePhoto">Удалить фото</div>
                <div class="cancel">Отменить</div>
            </div>
        </div>
        
    </div>
</template>
<script>
export default {
    props: ['needed'],
    methods: {
        changePhoto(){
            this.$emit('changePhoto');
        },
        deletePhoto(){
            this.$emit('deletePhoto')
        },
        showPhoto(){
            this.$emit('showPhoto')
        }
    }
}
</script>
<style lang="scss" scoped>
:not(i){
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 20px
}
.modal{
    z-index: 25;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 40px;
    &__inner{
        position: absolute;
        bottom: 40px;
        width: 100%;
    }
    &__options{
        margin: 0px 8px;
        :not(div.cancel){
            border: 1px solid #F3F3F3;
        }
        .option{
            background: #fff;
            height: 56px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #039BE5;
            &:first-child{
                border-top-left-radius: 15px;
                border-top-right-radius: 15px;
            }
            &:only-child{
                border-bottom-left-radius: 15px;
                border-bottom-right-radius: 15px;
            }
        }
        .delete__photo{
                color: #aaa;
                border-bottom-left-radius: 15px;
                border-bottom-right-radius: 15px;
            }
        .delete__photo{
            color: #E23050;
        }
        .cancel{
            margin-top: 8px;
            border-radius: 15px;
            background: #fff;
            height: 56px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #039BE5;
        }
    }
}
</style>