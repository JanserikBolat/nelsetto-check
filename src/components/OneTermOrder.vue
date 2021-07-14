<template>
    <div class="order__info">
        <p class="order__date">{{date}}</p>
        <p class="order__time">{{time}}</p>
    </div>
</template>
<script>
export default {
    props: ['date', 'time']
}
</script>
<style lang="sass" scoped>
$font-stack: 14px 'Roboto', sans-serif
p
    font: $font-stack
.order__info
    margin-left: 12px
    margin-right: 12px
</style>