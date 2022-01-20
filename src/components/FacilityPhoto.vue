<template>
  <div class="facility__photo" @click="goToPhotos">
    <div class="flex">
      <div class="flex__key">Фотографии</div>
      <i class="fas fa-chevron-right"></i>
    </div>
    <div class="value">Выберите фотографии</div>
  </div>
</template>
<script>
import {mapState} from "vuex";
export default {
  methods: {
    goToPhotos(){
      this.$router.push({name: 'facilityPhotos', params: {id: this.facility.id}})
    }
  },
  computed: {
    ...mapState('facility', ['facility'])
  }
}
</script>
<style lang="scss" scoped>
:not(i){
  font-size: 14px;
  line-height: 20px;
}
.facility{
  &__photo{
    background: #fff;
    box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
    max-height: 567px;
    padding: 16px;
    .value{
      color: rgba(0, 0, 0, 0.6);
      word-break: break-all;
    }
  }
}
.flex{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  &__key{
    font-size: 16px;
  }
  i{
    color: rgba(0, 0, 0, 0.6);
  }
}
</style>