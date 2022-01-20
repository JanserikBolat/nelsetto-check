<template>
    <div class="container" :class="{'free': selected}">
        <input type="checkbox" :checked="selected" @click.stop="handleSelect()" :disabled="!isFree">
        <p class="date">{{getDateFormat}}</p>
    </div>
</template>
<script>
export default {
    props: ['date', 'isFree'],
    data(){
        return{
            selected: false
        }
    },
    mounted(){
        this.selected = this.isFree;
    },
    computed: {
        getDateFormat(){
            return this.date.locale('ru').format('DD MMMM');
        }
    },
    methods: {
        handleSelect(){
            this.selected=!this.selected;
            this.$emit('handleSelect', {'date': this.date, 'isSelected': this.selected});
        }
    }
}
</script>
<style lang="scss" scoped>
.container{
    display: flex;
    align-items: center;
    height: 32px;
    background: #DADADA;
    border-radius: 2px;
    margin-bottom: 8px;
    padding: 7px;
    input{
        width: 18px;
        height: 18px;
    }
    p{
        color: rgba(0, 0, 0, 0.5);
        text-transform: uppercase;
        margin-left: 15.25px;
    }
}
.free{
    background: #EBF9FF;
    p{
        color: #000;
    }
}
</style>