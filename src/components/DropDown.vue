<template>
    <div class="dropdown">
        <select v-model="option" class="dropdown_select" @change="selected()" ref="select" @mousedown="mousedown()" @blur="blur()">
            <option v-for="opt, index in options" :key="index" :value="opt">{{opt}}</option>
        </select>
    </div>
</template>
<script>
export default {
    props: ['options', 'id'],
    data(){
        return{
            option:''
        }
    },
    methods: {
        selected(){
            this.$refs['select'].size=0;
            this.$emit('selected', this.option, this.id)
        },
        mousedown(){
            if(this.$refs['select'].options.length>5) this.$refs['select'].size = 5;
        },
        blur(){
            this.$refs['select'].size=0;
        }
    }
}
</script>
<style lang="scss" scoped>
.dropdown{
    position: relative;
    height: 20px;
    z-index: 2;
}
.dropdown_select{
    position: absolute;
    width: 100%;
}
</style>