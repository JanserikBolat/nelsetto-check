<template>
    <div class="playfield__specifications"  @click="clicked=true">
        <div class="backdrop" v-show="clicked" @click.stop="closePopup"></div>
        <div class="flex">
            <div class="flex__key">Характеристики</div>
            <i class="fas fa-chevron-right"></i>
        </div>
        <div class="value">{{getIndoor}}{{getSurface}}<br>{{getFormat}}{{getLengthWidth}}</div>
        <div class="specifications__inner">
        </div>
        <edit-popup v-show="clicked" @close="closePopup">
            <template v-slot:title>
                <p class="facility__title">Характеристики</p>
            </template>
            <template v-slot:content>
            <div class="content">
                <div class="content__inner">
                    <div class="indoor__type">
                        <div class="indoor__open" :class="{'activeIndoor': !chosenIndoor}" @click="setIndoor(0)">
                            <i class="fas fa-cloud-sun"></i>
                            <p class="open">Открытый</p>
                        </div>
                        <div class="indoor__close" :class="{'activeIndoor': chosenIndoor}" @click="setIndoor(1)">
                            <i class="fas fa-cloud-sun"></i>
                            <p class="close">Закрытый</p>
                        </div>
                    </div>
                    <div class="surface__type">
                        <label for="surface">Покрытие*</label>
                        <select name="surface" id="surface" v-model="surf_type">
                            <option value="">Выберите</option>
                            <option value="0">Трава</option>
                            <option value="1">Искусственная трава</option>
                            <option value="2">Паркет</option>
                            <option value="3">Грунт</option>
                            <option value="4">Песок</option>
                            <option value="5">Бетон</option>
                            <option value="6">Резина</option>
                        </select>
                    </div>
                    <div class="format__type">
                        <label for="format">Оптимальный формат*</label>
                        <select name="format" id="format" v-model="format">
                            <option value="">Выберите</option>
                            <option value="4">4vs4</option>
                            <option value="5">5vs5</option>
                            <option value="6">6vs6</option>
                            <option value="7">7vs7</option>
                            <option value="8">8vs8</option>
                            <option value="9">9vs9</option>
                            <option value="10">10vs10</option>
                            <option value="11">11vs11</option>
                        </select>
                    </div>
                    <div class="playfield__size">
                        <div class="playfield__width">
                            <label for="width">Ширина площадки</label>
                            <input type="text" name="width" id="width" placeholder="Введите ширину" v-model="width" inputmode="tel">
                        </div>
                        <div class="playfield__length">
                            <label for="length">Длина плошадки</label>
                            <input type="text" name="length" id="length" placeholder="Введите длину" v-model="length" inputmode="tel">
                        </div>
                    </div>
                </div>
            </div>
            </template>
            <template v-slot:button>
                <div class="save__btn">
                    <div class="btn" :class="{'active': isAllFilled}" @click.stop.prevent="saveSpecifications()">Сохранить</div>
                </div>
        </template>    
        </edit-popup>
    </div>
</template>
<script>
import EditPopup from './EditPopup.vue'
import axios from 'axios';
import {mapState, mapGetters} from 'vuex';
export default {
    data(){
        return{
            clicked: false,
            chosenIndoor: 0,
            width: '',
            length: '',
            format: '',
            surf_type: '',
            url: window.location.origin.replace('playfields.', '')
            
        }
    },
    mounted(){
        this.setValues();
    },
    computed: {
        ...mapState('playfield', ['playfield']),
        ...mapGetters('playfield', ['getSurface', 'getIndoor', 'getLengthWidth', 'getFormat']),
    },
    components: { EditPopup},
    methods: {
        isAllFilled(){
            return this.format&&this.surf_type&&this.width&&this.length;
        },
        closePopup(){
            this.clicked = false;
            this.setValues();
        },
        async saveSpecifications(){
            const sendData = {
                surf_type: parseInt(this.surf_type),
                indoor: !!this.chosenIndoor,
                length: this.length,
                width: this.width,
                format: parseInt(this.format)
            }
            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/playfield/${this.playfield.id}/update-data`, sendData,
            {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(()=>this.$store.dispatch('playfield/setSpecifications',sendData));
            this.clicked = false;
        },
        setValues(){
            this.changedName = this.playfield.pf_name;
            this.format = this.playfield.format;
            this.chosenIndoor = this.playfield.indoor;
            this.surf_type = this.playfield.surf_type;
            this.width = this.playfield.width;
            this.length = this.playfield.length;
        },
        setIndoor(indoor){
            this.chosenIndoor = indoor;
        },
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
    &__specifications{
            padding: 12px;
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
        &__width, &__length{
            display: flex;
            flex-direction: column;
            width: 100%;
        }
        &__width{
            margin-bottom: 8px;
        }
}
.indoor{
    &__type{
        display: flex;
        margin-bottom: 16px;
        .activeIndoor{
            background: #000;
            color: #fff;
        }
    }
    &__open{
        margin-right: 8px;
    }
    &__open , &__close{
        width: 50%;
        max-width: 172px;
        display: flex;
        align-items: center;
        color: rgba(0, 0, 0, 0.87);
        border: 1px solid #9D9D9D;
        height: 36px;
        padding: 8px;
        i{
            margin-right: 5px;
        }
    }
}
.surface__type, .format__type{
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
}
  #surface, #width, #length, #format{
        height: 36px;
        padding: 8px;
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