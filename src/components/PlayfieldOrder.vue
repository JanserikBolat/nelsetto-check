<template>
    <div class="playfield__order" @click="clicked=true">
        <div class="backdrop" v-show="clicked" @click.stop="closePopup"></div>
        <div class="flex">
            <div class="flex__key">№ площадки</div>
            <i class="fas fa-chevron-right"></i>
        </div>
        <div class="value">{{playfield.local_sort}}</div>
        <edit-popup v-show="clicked" @close="closePopup">
        <template v-slot:title>
            <p class="facility__title">№ площадки</p>
        </template>
        <template v-slot:content>
            <div class="content">
                <div class="content__inner">
                    <p class="index__required">№ площадки*</p>
                    <input type="text" inputmode="numeric" name="name" id="index" placeholder="Например: 1" v-model="index" maxlength="1">
                </div>
            </div>
        </template>
        <template v-slot:button>
            <div class="save__btn">
                <div class="btn" :class="{'active':index.length}" @click.stop="saveName()">Сохранить</div>
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
            index: '',
            url: window.location.origin.replace('playfields.', '')
        }
    },
    created(){
        this.setValues();
    },
    computed: {...mapState('playfield', ['playfield'])},
    components: {EditPopup},
    methods: {
        closePopup(){
            this.clicked = false;
        },
        async saveName(){
            if(this.index===this.playfield.local_sort){
                this.clicked = false;
                return;
            }
            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/playfield/${this.playfield.id}/update-data`, {local_sort: this.index},
            {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(()=>this.$store.dispatch('playfield/setPlayfieldIndex',this.index));
            this.clicked = false;
        },
        setValues(){
            this.index = this.playfield.local_sort||'';
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
.playfield{
    &__order{
            padding: 16px;
            background: #fff;
            box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
            .value{ 
                color: rgba(0, 0, 0, 0.6);
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
        }
}
.content{
    .index__required{
        color: rgba(0, 0, 0, 0.87);
        margin-bottom: 8px;
    }
    #index{
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
  z-index: 10;
}
.save__btn{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
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