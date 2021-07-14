<template>
<div>
<div v-for="user in info" :key="user.id" class="user__info">
    <div class="name__surname">
        <h5>{{user.first_name}}</h5><h5>{{user.last_name}}</h5>
    </div>
    <div class="user__photo">
        <img :src="user.avatar" alt="Photo">
    </div>
</div>
</div>
</template>

<script>
export default{
    props: ['info'],
    data(){
        return{
            photo: this.info.avatar
        }
    }
}

</script>
<style lang="sass" scoped>
div
    margin-left: 12px
    margin-right: 12px
    .user__info
        width: 100%
        height: 179px
        display: flex
        justify-content: space-between
        align-items: flex-start
        .name__surname
            display: flex
        .user__photo
            width: 64px
            height: 64px
            img
                width: 100%
                height: 100%
                border: 1px solid black
                border-radius: 50%
</style>