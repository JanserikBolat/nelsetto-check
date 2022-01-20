<template>
    <div class="facility">
         <MainHeader @changed="changed">
            <template v-slot:title>
                <p class="title">Настройки</p>
            </template>
        </MainHeader>
        <div class="content">
            <div class="content__inner">
                <div class="add__photo">
                    <div class="backdrop" v-show="photoAction||show" @click.stop="photoAction=false; show = false"></div>
                    <div class="photo__icon" @click="photoAction = true">
                        <input type="file" name="file" ref="facility__photo" @change="setPhoto" accept="image/png, image/jpeg">
                        <i class="fas fa-camera" v-if="hasNotPhoto"></i>
                        <img v-else-if="!hasNotPhoto" :src="`${url}/${facility.avatar}`">
                    </div>
                </div>
                <FacilityName />
                <FacilityPhoto />
                <FacilityAddress/>
                <FacilityContact />
                <FacilityDescription/>
                <FacilityInfrastructure/>
                <FacilityPayment/>
                <p class="playfields">Площадки</p>
                <playfield-card @goToPlayfield="goToPlayfield" v-for="p in facility.playfields" :key="p.id" :playfield="p"/>
                  <div class="logout_btn">
                    <button class="logout" @click.stop="logOut">Выйти</button>
                </div>
            </div>
        </div>
        <PhotoModal v-show="photoAction" @changePhoto="changePhoto" @deletePhoto="deletePhoto" :needed="!hasNotPhoto" @showPhoto="showPhoto"/>
        <photo-card :path="`${url}/${facility.avatar}`" v-show="show" @closePhoto="show = false"/>
        <bottom-menu/>
    </div>
</template>
<script>
import BottomMenu from '../components/BottomMenu.vue'
import MainHeader from '../components/MainHeader.vue'
import PlayfieldCard from '../components/PlayfieldCard.vue'
import FacilityName from '../components/FacilityName.vue'
import FacilityAddress from '../components/FacilityAddress.vue'
import {mapState} from 'vuex';
import FacilityDescription from '../components/FacilityDescription.vue'
import FacilityInfrastructure from '../components/FacilityInfrastructure.vue'
import FacilityPayment from '../components/FacilityPayment.vue'
import FacilityContact from '../components/FacilityContact.vue'
import FacilityPhoto from "../components/FacilityPhoto.vue";
import PhotoModal from '../components/PhotoModal.vue'
import PhotoCard from '../components/PhotoCard.vue'
import axios from 'axios'
export default {
    data(){
        return{
            photo: '',
            photoAction:false,
            show: false,
            url: window.location.origin.replace('playfields.', '')
        }
    },
    mounted(){
        window.scrollTo(0,0)
    }, 
    components: {MainHeader, PhotoCard, PlayfieldCard, BottomMenu,FacilityPhoto,  FacilityName, FacilityAddress, FacilityDescription, FacilityInfrastructure, FacilityPayment, FacilityContact, PhotoModal},
    methods: {
        changed(id){
            this.start = true;
            this.$store.dispatch('facility/resetFacility', parseInt(id)).then(()=>this.start = false);
            sessionStorage.setItem('active_facility', parseInt(id))
        },
        goToPlayfield(p_id){
           this.$router.push({name: 'playfield', params: {id: this.facility.id, p_id: p_id}})
        },
        changePhoto(){
            this.$refs['facility__photo'].click();
        },
        async setPhoto(){
            this.photoAction = false;
            this.photo = this.$refs['facility__photo'].files[0];
            let formData = new FormData();
            formData.append('file', this.photo);
            await axios.post( `https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${this.facility.id}/load-avatar`,
              formData,
              {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${window.$cookies.get('access_token')}`
                }
              }
            ).then((res)=>{
                this.$store.dispatch('facility/setFacilityAvatar', res.data.path);
            })
            .catch(function(){
              console.log('FAILURE!!');
            });
        },
        async deletePhoto(){
            axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${this.facility.id}/remove-avatar`, {}, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(()=>this.$store.dispatch('facility/setFacilityAvatar','default_avatar.png')).catch(e=>console.log(e));
            this.photoAction = false;
        },
        showPhoto(){
            this.photoAction = false;
            this.show = true;
        },
        logOut(){
            window.$cookies.remove('id');
            window.$cookies.remove('access_token');
            sessionStorage.removeItem('facilities');
            sessionStorage.removeItem('active_facility');
            this.$router.push({name: 'authorization'});
        }
    }, computed: {...mapState('facility', ['facility']),
    hasNotPhoto(){
        return this.facility.avatar==='default_avatar.png'
    }}
}
</script>
<style lang="scss" scoped>
    .content{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 49px;
        margin-top: 98px;
        .content__inner{
            width: 375px;
        }
    }
.facility{
    min-height: 100vh;
    background: #E5E5E5;
    p, button{
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
    }
    &__title{
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        text-align: center;
        letter-spacing: 0.15px;
        color: rgba(0, 0, 0, 0.87);
    }
    &__name, &__address, &__description, &__infrastructure, &__payment{
        padding: 16px;
        background: #fff;
        box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
        .value{ 
            color: rgba(0, 0, 0, 0.6);
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
.add__photo{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 92px;
    .photo__icon{
        background: rgba(0, 0, 0, 0.12);
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60px;
        height: 60px;
        position: relative;
        input{
            position: absolute;
            width: 0;
            height: 0;
            opacity: 0;
        }
        img{
            position: absolute;
            max-width: 100%;
            max-height: 100%;
        }
    }
}
p.playfields{
    color: rgba(0, 0, 0, 0.6);
    margin: 24px 0px 8px 16px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;

}
.logout_btn{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 8px 0px;
    .logout{
        background: red;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px 7px;
        border-radius: 5px;
        cursor: pointer;
        border: none;
    }
}
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
</style>