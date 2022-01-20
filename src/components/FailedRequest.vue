<template>
        <div class="fail">
            <div class="fail__inner">
                <div class="error__title">
                    <i class="fas fa-times-circle"></i>
                </div>
                <div class="error__img">

                </div>
                <p class="error__message">message</p>
            </div>
        </div>
</template>
<script>
export default {
    props: ['message']
}
</script>
<style lang="scss" scoped>

</style>