<template>
    <div class="playfield">
        <div class="playfield__inner">
        <menu-header :backButton="true" @back ="goBack">
            <template v-slot:title>
                <p class="playfield__title">{{playfield.pf_name}}</p>
            </template>
        </menu-header>
        <div class="content">
            <div class="content__inner">
                <PlayfieldName/>
                <PlayfieldSpecifications/>
                <PlayfieldOrder />
                <PlayfieldWorkingHours/>
            </div>
        </div>
        </div>
    </div>
</template>
<script>
import MenuHeader from '../components/MenuHeader.vue'
import PlayfieldName from '../components/PlayfieldName.vue'
import PlayfieldSpecifications from '../components/PlayfieldSpecifications.vue'
import PlayfieldWorkingHours from '../components/PlayfieldWorkingHours.vue'
import PlayfieldOrder from '../components/PlayfieldOrder.vue'
import {mapState, mapGetters} from 'vuex'
export default {
  components: { MenuHeader, PlayfieldName, PlayfieldSpecifications, PlayfieldWorkingHours, PlayfieldOrder},
  computed: {
      ...mapState('playfield', ['playfield']),
      ...mapState('facility', ['facility']),
      ...mapGetters('playfield', ['getSurface', 'getIndoor', 'getLengthWidth', 'getFormat'])
  },
  mounted(){
      window.scrollTo(0,0)
  },
  methods: {
      goBack(){
          this.$router.push({name: 'myFacility', params: {id: this.facility.id}});
      }
  }
}
</script>
<style lang="scss" scoped>
:not(i){
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
}
.playfield{
    min-height: 100vh;
    background: #E5E5E5;
    &__title{
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        text-align: center;
        letter-spacing: 0.15px;
        color: rgba(0, 0, 0, 0.87);
    }
    &__characteristic, &__workingHours{
        padding: 16px;
        background: #fff;
        box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
        .value{ 
            color: rgba(0, 0, 0, 0.6);
        }
    }
    &__workingHours{
        margin: 16px 0 24px;
    }
    &__save{
        .save__btn{
            width: 320px;
            height: 36px;
            display: flex;
            background: rgba(0, 0, 0, 0.2);
            color: #fff;
        }
    }
}
.flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    &__center{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &__key{
        font-size: 16px;
    }
    i{
        color: rgba(0, 0, 0, 0.6);
    }
}
</style>