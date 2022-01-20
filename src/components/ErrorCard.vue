<template>
  <div class="error_card">
    <div class="error_title">
      ОШИБКА
    </div>
    <div class="error_message">
      {{message}}
    </div>
    <div class="button_wrapper">
      <span class="error_button" @click.stop = "close">ХОРОШО</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message'],
  methods: {
    close(){
      this.$emit('close');
    }
  }
}
</script>

<style scoped lang="scss">
.error_card{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  box-shadow: 0px 24px 38px rgba(0, 0, 0, 0.14), 0px 9px 46px rgba(0, 0, 0, 0.12), 0px 11px 15px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 20px 24px;
  z-index: 15;
  min-width: 280px;
  .error_title{
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 15px;
  }
  .button_wrapper{
    display: flex;
    justify-content: flex-end;
    margin-top: 25px;
    .error_button{
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      text-align: right;
      letter-spacing: 1.25px;
      text-transform: uppercase;
      color: #03A9F4;
    }
  }
}
</style>