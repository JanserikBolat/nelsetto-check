<template>
    <div class="facility__name" @click="clicked=true">
        <div class="backdrop" v-show="clicked" @click.stop="closePopup"></div>
        <div class="flex">
            <div class="flex__key">Название</div>
            <i class="fas fa-chevron-right"></i>
        </div>
        <div class="value">{{facility.fc_name}}</div>
        <edit-popup v-show="clicked" @close="closePopup">
        <template v-slot:title>
            <p class="facility__title">Название</p>
        </template>
        <template v-slot:content>
            <div class="content">
                <div class="content__inner">
                    <p class="name__required">Название сооружения*</p>
                    <input type="text" name="name" id="facility_name" placeholder="Например: Плошадка №1" v-model="changedName" maxlength="25">
                </div>
            </div>
        </template>
        <template v-slot:button>
            <div class="save__btn">
                <div class="btn" :class="{'active':changedName.trim().length}" @click.stop="saveName()">Сохранить</div>
            </div>
        </template>
        </edit-popup>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import EditPopup from './EditPopup.vue'
import axios from 'axios'
export default {
    data(){
        return{
            clicked: false, 
            changedName: '',
            url: window.location.origin.replace('playfields.', '')
        }
    },
    created(){
        this.setValues();
    },
    components: {EditPopup},
    computed: {...mapState('facility', ['facility'])},
    methods: {
        closePopup(){
            this.clicked = false;
            this.setValues();
        },
        async saveName(){
            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${this.facility.id}/update-data`, {fc_name: this.changedName}, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(e=>this.$store.dispatch('facility/setFacilityName', e.data.facility.fc_name));
            this.clicked = false;
        },
        setValues(){
            this.changedName = this.facility.fc_name;
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
    &__name{
        background: #fff;
        box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
        max-height: 567px;
        .value{ 
            color: rgba(0, 0, 0, 0.6);
            word-break: break-all;
        }
    }
    &__title{
        font-weight: 500;
        font-size: 20px;
        line-height: 32px;
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
.content{
    padding: 16px;
    .name__required{
        color: rgba(0, 0, 0, 0.87);
        margin-bottom: 8px;
    }
    #facility_name{
        width: 100%;
        height: 36px;
        border: 1px solid #9D9D9D;
        padding: 8px;
        outline: none;
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
.save__btn{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    .btn{
        padding: 8px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        background: rgba(0, 0, 0, 0.2);
        pointer-events: none;
        width: 100%;
        max-width: 343px;
    }
    .active{
        pointer-events: initial;
        background: #000;
    }
}
</style>