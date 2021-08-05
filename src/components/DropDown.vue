<template>
    <div class="dropdown">
        <div class="select-box">
        <div class="options-container" :class="active?'active':''">
          <div class="option" v-for="el, index in options" :key="index" @click="handleClick(el)">
            <input
              type="radio"
              class="radio"
              :id="`${id}-${index}`"
            />
            <label :for="index" :ref="index">{{id==='date'?getDateFormat(el): el}}</label>
          </div>
        </div>

        <div class="selected" :ref="`${id}-selected`" @click="active=!active">
          {{id==='date'?getDateFormat(initialValue): initialValue}}
        </div>
      </div>
    </div>
</template>
<script>
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    props: ['options', 'id', 'initialValue'],
    data(){
        return{
            option:'',
            active: false
        }
    },
    methods: {
        handleClick(el){
            this.$refs[`${this.id}-selected`].innerHTML = this.id==='date'?this.getDateFormat(el): el;
            this.active = false;
            this.$emit('selected', el, this.id);
        },
        getDateFormat(el){
            return dayjs(el).locale('ru').format('DD MMMM, YYYY')
        }
    }
}
</script>
<style lang="scss" scoped>
.select-box {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.select-box .options-container {
  background: #2f3640;
  color: #f5f6fa;
  max-height: 0;
  width: 100%;
  opacity: 0;
  transition: all 0.4s;
  border-radius: 8px;
  overflow: hidden;

  order: 1;
}

.selected {
  background: #2f3640;
  border-radius: 8px;
  margin-bottom: 8px;
  color: #f5f6fa;
  position: relative;

  order: 0;
}

.selected::after {
  content: "";
  background: url("../assets/arrow-down.svg");
  background-size: contain;
  background-repeat: no-repeat;

  position: absolute;
  height: 100%;
  width: 32px;
  right: 10px;
  top: 5px;

  transition: all 0.4s;
}

.select-box .options-container.active {
  max-height: 240px;
  opacity: 1;
  overflow-y: scroll;
}

.select-box .options-container.active + .selected::after {
  transform: rotateX(180deg);
  top: -6px;
}

.select-box .options-container::-webkit-scrollbar {
  width: 8px;
  background: #0d141f;
  border-radius: 0 8px 8px 0;
}

.select-box .options-container::-webkit-scrollbar-thumb {
  background: #525861;
  border-radius: 0 8px 8px 0;
}

.select-box .option,
.selected {
  padding: 12px 24px;
  cursor: pointer;
}

.select-box .option:hover {
  background: #414b57;
}

.select-box label {
  cursor: pointer;
}

.select-box .option .radio {
  display: none;
}
</style>