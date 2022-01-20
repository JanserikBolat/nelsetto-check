<template>
    <div class="facilityCard" @click="goToFacility">
        <div class="facilityCard__inner">
            <div class="flex">
                <p class="facility__name">{{facility.fc_name}}</p>
                <i class="fas fa-chevron-right"></i>
            </div>
            <div class="playfields__amount">
                {{facility.pf_amount}} площадка(-и)
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    props: ['facility'],
    data(){
      return{
        url: window.location.origin.replace('playfields.', '')
      }
  },
    methods: {
        async goToFacility(){
            await axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${this.facility.id}`, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then((res)=>{
                this.$store.dispatch('facility/setFacility', res.data.facility);
                })
            this.$router.push({name:'myFacility', params: {id: this.facility.id}})
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
    line-height: 20px;
}
.facilityCard{
    background: #fff;
    padding: 18px 16px;
    box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
}
.flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .facility__name{
        font-size: 16px;
        text-transform: uppercase;
        color: #2B2D38;
        word-break: break-all;
    }
    i{
        color: rgba(0, 0, 0, 0.6);
    }
}
.playfields__amount{
    color: rgba(0, 0, 0, 0.6);
}
</style>