<template>
<div class="spinner__wrapper" v-if="start">
    <div class="spinner">
        <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    props: ['start']
}
</script>
<style lang="scss" scoped>
.spinner__wrapper{
    z-index: 25;
    width: 100%;
    height: 100%;
    background-color: rgba(255,255,255,0.7);
    position: absolute;
    pointer-events: all;
}
.spinner{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.lds-ring {
  display: inline-block;
  position: relative;
  width: 48px;
  height: 48px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 32px;
  height: 32px;
  margin: 8px;
  border: 4px solid #03a9f4;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #03a9f4 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>