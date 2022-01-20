<template>
    <div class="myFacilities">
        <Spinner :start="start"/>
        <MenuHeader :backButton = false :logout="true">
            <template v-slot:title>
                <p class="my-facilities">Мои сооружения</p>
            </template>
            <template v-slot:logout>
                <div class="back_btn" @click.stop="logOut">
                    Выйти
                </div>
            </template>
        </MenuHeader>
        <FacilityCard v-for="f in facilities" :key="f.id" :facility="f"/>
        <BottomMenu />
    </div>
</template>
<script>
import MenuHeader from '../components/MenuHeader.vue'
import BottomMenu from '../components/BottomMenu.vue'
import FacilityCard from '../components/FacilityCard.vue'
import axios from 'axios'
import Spinner from '../components/Spinner.vue'
import {mapState} from 'vuex'
export default {
    components: {MenuHeader, BottomMenu, FacilityCard, Spinner},
    data(){
        return{
            start: true, 
            facilities: [],
            url: window.location.origin.replace('playfields.', '')
        }
    },
    async mounted(){
        window.scrollTo(0,0)
        this.facilities = await axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facilities`, {
            headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
        }).then(res=>{
            this.start = false;
            return res.data.user.facilities
        }).catch(e=>console.log(e));
    },
    methods: {
        logOut(){
            window.$cookies.remove('id');
            window.$cookies.remove('access_token');
            sessionStorage.removeItem('facilities');
            sessionStorage.removeItem('active_facility');
            this.$router.push({name: 'authorization'});
        }
    },
    computed: {...mapState('admin', ['user'])}
}
</script>
<style lang="scss" scoped>
:not(i){
    font-family: 'Roboto', sans-serif;
    font-weight: normal;
    font-style: normal;
    font-size: 14px;
    line-height: 20px;
}
.myFacilities{
    background: #E5E5E5;
    min-height: 100vh;
}
p.my-facilities{
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.15px;
    color: rgba(0, 0, 0, 0.87);
}
.back_btn{
    background: red;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 20px;
    padding: 5px 7px;
    border-radius: 5px;
    cursor: pointer;
}
</style>