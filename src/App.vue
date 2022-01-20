<template>
  <div id="app">
    <spinner :start="!isInitialized" />
    <router-view v-if="isInitialized"></router-view>
  </div>
</template>
<script>
import Spinner from './components/Spinner.vue'
export default {
  async created(){
    let authorized = !!window.$cookies.get('access_token');
    if(authorized){
      if(sessionStorage.getItem('active_facility')){
        await this.$store.dispatch('facility/resetFacility', sessionStorage.getItem('active_facility')).then(()=>this.isInitialized = true);
      }
      else{
        await this.$store.dispatch('facility/getAllFacilities').then(()=>this.isInitialized = true);
      }
    }
    else{
      this.isInitialized = true;
    }
  },
  data(){
    return{
      isInitialized: false
    }
  },
  components: {
    Spinner
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: normal;
}
input, textarea{
  font-size: 16px!important;
}
</style>
