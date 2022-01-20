<template>
    <div class="editPopup">
        <div class="editPopup__inner">
            <div class="editPopup__header">
                <slot name="title"></slot>
                <div class="close__btn">
                    <i class="fas fa-times" @click.stop="close"></i>
                </div>
            </div>
            <div class="editPopup__content">
                <slot name="content"></slot>
            </div>
            <slot name="button"></slot>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        close(){
            this.$emit('close');
        }
    }
}
</script>
<style lang="scss" scoped>
.editPopup{
    position: fixed;
    background: #fff;
    z-index: 36;
    border-radius: 8px 8px 0px 0px;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 567px;
    overflow-y: auto;
    &__header{
        display: flex;
        justify-content: space-between;
        background: #fff;
        padding: 16px;
        box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.05);
    }
}
</style>