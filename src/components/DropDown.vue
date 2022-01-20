<template>
  <div class="dropdown">
    <div class="backdrop" v-show="toggleDropdown" @click.stop="toggleDropdown = false"></div>
    <div class="chosen" @click.stop="toggleDropdown=!toggleDropdown" :class="{'fixed':fixed}">
      <div class="value">
        <slot name="image"/>
        <span>
          <label>{{selectedText}}</label>
        </span>
      </div>
      <i class="fa fa-caret-down icon"></i>
    </div>
    <div class="dropdown__options" :class="{'show':toggleDropdown}">
      <div class="dropdown__option" v-for="value, index in options" :key="index" :value="value.value" @click.stop="setSelect(value)">{{value.text}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['options', 'initialValue', 'id', 'fixed'],
  data(){
    return{
      selected: '',
      selectedText: 'Выберите',
      toggleDropdown: false
    }
  },
  created(){
      this.selected = this.initialValue.value;
      this.selectedText = this.initialValue.text;
  },
   watch: {
    'initialValue.value': function (){
        this.selected = this.initialValue.value;
        this.selectedText = this.initialValue.text;
    }
  },
  methods: {
    setSelect(e){
      this.selected = e.value;
      this.selectedText = e.text;
      this.toggleDropdown = false;
      this.$emit('selected', {value: this.selected, text: this.selectedText}, this.id);
    }
  }
}
</script>
<style lang="scss" scoped>
:not(i){
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px
}
.dropdown{
  width: 100%;
  position: relative;
  max-height: 30px;
  .backdrop{
    position: fixed;
    top: 0;
    left: 0;
    bottom:0;
    right:0;
    background: transparent;
  }
  .chosen{
    padding: 5px 8px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #9D9D9D;
    z-index: 10;
    overflow: hidden;
    .value{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    span{
      margin-left: 4px;
    }

  }
  .fixed{
    pointer-events: none;
    background: #9D9D9D;
  }
  &__options{
    position: absolute;
    background: #fff;
    width: 100%;
    max-height: 150px;
    overflow-y: scroll;
    border: 1px solid #9D9D9D;
    display: none;
    z-index: 15;
  }
  .show{
      display: block;
    } 
  &__option{
    padding: 5px 8px;
  }
}
</style>