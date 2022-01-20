<template>
    <div class="facility__address" @click.stop="clicked=true">
        <div class="backdrop" v-show="clicked" @click.stop="closePopup"></div>
        <div class="flex">
            <div class="flex__key">Адрес</div>
            <i class="fas fa-chevron-right"></i>
        </div>
        <div class="value">{{facility.address}}</div>
        <edit-popup v-show="clicked" @close="closePopup">
            <template v-slot:title>
                <p class="facility__title">Адрес</p>
            </template>
            <template v-slot:content>
                <div class="content">
                    <div class="content__inner">
                        <p class="facility__location">Местоположение*</p>
                        <div class="facility__map">
                            <i class="fas fa-map-marker-alt"></i>
                            <input type="text" name="map" id="map" placeholder="Укажите адрес на карте, либо введите вручную" v-model="address" disabled>
                        </div>
                        <div class="inMap__btn">
                            <div class="map__btn">

                            </div>
                            <div id="mapid"></div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:button>
                <div class="save__btn">
                    <div class="btn active" @click.stop="saveLocation">Сохранить</div>
                </div>
            </template>
        </edit-popup>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import EditPopup from './EditPopup.vue'
import leaflet from 'leaflet';
import axios from 'axios';
export default {
    data(){
        return{
            clicked: false,
            long: 0,
            lat: 0,
            address:'',
            url: window.location.origin.replace('playfields.', '')
            
        }
    },
    created(){
        this.setValues();
    },
    mounted(){
      this.setMap();
    },
    computed: {...mapState('facility', ['facility'])},
    components: {EditPopup},
    methods: {
      setMap(){
        let mymap = leaflet.map('mapid').setView([this.lat, this.long], 18);
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);
        let marker = leaflet.marker([this.lat, this.long]).addTo(mymap);

        window.dispatchEvent(new Event('resize'));

        mymap.on('click', (e)=>{
          marker.setLatLng(e.latlng);
          mymap.setView(marker.getLatLng(),mymap.getZoom());
          const {lat: lat, lng: long} = marker.getLatLng();

          this.lat = lat;
          this.long = long;

          axios.get(`https://api.opencagedata.com/geocode/v1/json?&key=0c63f52ded21aee72fecbb8563769237&q=${lat}+${long}`).then(e=>this.address = e.data.results[0].formatted);
        });
      },
        closePopup(){
            this.clicked = false;
            this.setValues();
        },
        setValues(){
            this.long = parseFloat(this.facility.longitude);
            this.lat = parseFloat(this.facility.latitude);
            this.address = this.facility.address;
        },
        async saveLocation(){
            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${this.facility.id}/update-data`, {longitude: this.long, latitude: this.lat, address: this.address},
            {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            })
            .then(e=>{
                this.$store.dispatch('facility/setFacilityCoordinates', {address: e.data.facility.address, lng: e.data.facility.longitude, lat:  e.data.facility.latitude});
                });
            this.clicked = false;
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
.facility{
    &__address{
        background: #fff;
        box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
        max-height: 567px;
        .value{ 
            color: rgba(0, 0, 0, 0.6);
        }
    }
    &__title{
        font-weight: 500;
        font-size: 20px;
        line-height: 32px;
    }
    &__map{
        position: relative;
        height: 36px;
        i{
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
        }
        #map{
            width: 100%;
            height: 36px;
            padding-left: 32px;
        }
    }
    &__location{
            color: rgba(0, 0, 0, 0.87);
            margin-bottom: 8px;
        }
}
.content{
  padding: 16px;
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
.save__btn{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
    .btn{
        padding: 8px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        background: rgba(0, 0, 0, 0.2);
        pointer-events: none;
        max-width: 100%;
        width: 343px;
    }
    .active{
        pointer-events: initial;
        background: #000;
    }
}
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 18;
}
#mapid { 
    width: 100%;
    height: 275px;
    margin: 24px 0 20px;
 }
</style>