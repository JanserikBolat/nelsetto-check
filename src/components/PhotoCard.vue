<template>
    <div class="photo">
        <div class="photo__inner">
            <div class="close_btn">
                <i class="fas fa-times" @click.stop="closePhoto"></i>
            </div>
            <div class="img">
                <img :src='path' alt="Здесь должно было быть фото">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['path'],
    methods: {
        closePhoto(){
            this.$emit('closePhoto')
        }
    }
}
</script>
<style lang="scss" scoped>
.photo{
    width: 50%;
    max-height: 50%;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    z-index: 20;
    &__inner{
        width: 100%;
        height: 100%;
        .close_btn{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-bottom: 13px;
            i{
                color: white
            }
        }
        .img{
            img{
            width: 100%;
            height: 100%;
            }
        }
    }
}
</style>