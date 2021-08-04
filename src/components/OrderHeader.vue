<template>
<div class="header">
    <div class="header__inner">
        <div class="header__top">
            <slot name="orderHeader"></slot>
            <slot name= "newUser"></slot>
        </div>
        <slot name="headerBottom"></slot>
    </div>
</div>
</template>
<script>
export default{    
}
</script>
<style lang="sass" scoped>
$font-stack: 'Roboto', sans-serif
.header
    width: 100%
    display: flex
    flex-direction: column
    justify-content: center
    background: #FFFFFF
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04)
.header__inner
    margin: 16px 8px 18px
    .header__top
        display: flex
        justify-content: space-between
        align-items: center
        margin-bottom: 8px
        .new__order
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
        p
            font-family: $font-stack
            font-style: normal
            font-weight: normal
            font-size: 14px
            line-height: 20px


</style>