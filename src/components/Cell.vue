<template>
    <div class="timetable__cell" :class="{'reserved': isReserved}"
        @click="handleClick()"
    >
            {{value}}
    </div>
</template>
<script>
export default {
    data(){
        return{
            isReserved: typeof this.value!=='number'
        }
    },
    props: ['field', 'index', 'value'],
    methods: {
        handleClick(){
            if(!this.isReserved){
                this.$emit('makeOrder');
            }
            else{
                this.$emit('showInfoAboutOrder')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .timetable__cell{
        width: 49px;
        height: 100%;
        margin-left: 1px;
        background-color: #fff;
        font-family: 'Roboto', sans-serif;
        font-size: 12px;
        line-height: 20px;
        color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    .reserved{
        background: grey;
    }
</style>