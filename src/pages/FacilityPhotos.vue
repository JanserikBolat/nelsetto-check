<template>
<div class="facility_photos" v-if="!sending">
  <spinner :start="start" v-if="start"/>
  <menu-header :backButton="true" @back ="goBack">
    <template v-slot:title>
      <p class="facility_photo_title">Фотографии</p>
    </template>
  </menu-header>
  <div class="content">
    <p class="photo_title">Добавьте фотографии</p>
    <div class="main_photo" v-if="images.length">
      <img :src="images[0]" alt="main">
      <div class="delete_photo" @click.stop="removeUpload(0)">
        <i class="fas fa-times"></i>
      </div>
    </div>
    <div class="other_photos">
      <template v-for="(photo, index) in images.slice(1)">
        <div class="other_photo" :key="index+1">
          <img :src="photo" :alt="`${photo}_${index+1}`">
          <div class="delete_photo" @click.stop="removeUpload(index+1)">
            <i class="fas fa-times"></i>
          </div>
        </div>
      </template>

      <div class="add_photo" @click.stop="addPhoto()" v-if="images.length<6">
        <div class="icon">
          <img src="/img/addPhoto.svg" alt="add_photo">
          <span>Добавить</span>
        </div>
          <input type="file" name="file" ref="facility_photo" accept="image/png, image/jpeg" @change="uploadPhoto()" multiple="multiple">
      </div>
    </div>

    <div class="saveChanges">
      <div class="btn" @click.stop="prepareFiles">
        Сохранить
      </div>
    </div>
  </div>
  <error-card :message="message" :error="error" @close="error = false" v-if="error"/>
</div>
</template>

<script>
import MenuHeader from "../components/MenuHeader.vue";
import ErrorCard from "../components/ErrorCard.vue";
import {mapState} from "vuex";
import axios from "axios";
import Spinner from "../components/Spinner";
export default {
  data() {
    return {
      sending: false,
      images: [],
      initialLength: 0,
      message: "",
      error: false,
      addedPhotos: [],
      send: [],
      start: false,
      url: window.location.origin.replace('playfields.', ''),
    };
  },
  mounted() {
    this.start = true;
    axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${this.facility.id}/show-images`,
        {
          headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
        }).then(res=> {
          this.images = res.data.images?.map(e=>`https://almvtst.ml`+e.replace('public', ''))??[]
          this.sending = false;
          this.initialLength = this.images.length;
        }).finally(()=>this.start = false);
  },
  components: {
    Spinner,
    MenuHeader,
    ErrorCard
  },
  methods: {
    addPhoto(){
      this.$refs['facility_photo'].click();
    },
    uploadPhoto(){
      if(this.images.length+this.$refs['facility_photo'].files.length>6){
        this.error = true;
        this.message = "Количество фотографий для одного сооружения не может быть больше 6!";
      }
      this.addedPhotos = [...this.$refs['facility_photo'].files].slice(0, 6 - this.images.length);
      this.addedPhotos.forEach(e=>this.images.push(URL.createObjectURL(e)));
    },
    removeUpload(index){
      this.images = this.images.filter((e, i)=>i!==index);
    },
    prepareFiles(){
      this.send = [];
      Promise.all(
          this.images.map((e)=> fetch(e,{
            headers: {
              "Access-Control-Allow-Origin": "*"
            }}).then(res =>{
            console.log(res);
            return res.blob()
          }).then(blob => {
            console.log(blob);
            const file = new File([blob], 'photo', {type:'image/jpeg, image/png'});
            this.send.push(file);
            console.log(file);
          }))).then(()=> this.sendFiles());
    },
    sendFiles(){
      this.start = true;
      let formData = new FormData();
      this.send.forEach((e, i)=>formData.append(`file[${i}]`, e));
      axios.post( `https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${this.facility.id}/update-images`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${window.$cookies.get('access_token')}`
            }
          }).catch(()=>{this.error = true; this.message = "К сожалению, не удалось загрузить файлы!"}).finally(()=>this.start = false);
    },
    goBack(){
      this.$router.go(-1);
    }
  },
  computed: {
    ...mapState('facility', ['facility'])
  }
};
</script>

<style scoped lang="scss">
.facility_photos{
  min-height: 100vh;
  &__title{
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.15px;
    color: rgba(0, 0, 0, 0.87);
  }
  .content{
    padding: 16px;
    .photo_title{
      margin-bottom: 16px;
      font-weight: 500;
      font-size: 16px;
    }
    .main_photo{
      position: relative;
      margin-bottom: 12px;
      height: 0;
      width: 100%;
      padding-top: 56.25%;
      img{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-radius: 4px;
      }
    }
    .other_photos{
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      .other_photo{
        position: relative;
        width: 105px;
        height: 65px;
        img{
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
      .add_photo{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #E7E7E7;
        border-radius: 8px;
        padding: 10px 0px;
        .icon{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 105px;
        }
        input{
          position: absolute;
          width: 0;
          height: 0;
          opacity: 0;
        }
      }
    }
    .saveChanges{
      margin-top: 8px;
      display: flex;
      justify-content: center;
      .btn{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px 0;
        width: 100%;
        max-width: 343px;
        background: #000;
        color: #fff;
      }
    }
    .delete_photo{
      position: absolute;
      top: -5px;
      right: -5px;
      background: #000;
      width: 20px;
      height: 20px;
      border-radius: 25px;

      display: flex;
      justify-content: center;
      align-items: center;

      i{
        color: #fff;
      }
    }
  }
}
</style>