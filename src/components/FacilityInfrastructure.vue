<template>
    <div class="facility__infrastructure" @click.stop="clicked = true">
        <div class="backdrop" v-show="clicked" @click.stop="closePopup"></div>
        <div class="flex">
            <div class="flex__key">Инфраструктура</div>
            <i class="fas fa-chevron-right"></i>
        </div>
        <div class="value">
            <div class="infr__option" v-for="option, index in selectedOptions" :key="index">
                <div class="option">{{getValue(option)}}</div>
                <div class="circle"></div>
            </div>
        </div>
        <edit-popup v-show="clicked" @close="closePopup">
            <template v-slot:title>
                <p class="facility__title">Инфраструктура</p>
            </template>
            <template v-slot:content>
                <div class="content">
                    <div class="content__inner">
                        <div class="shower common">
                            <input type="checkbox" name="shower" id="shower" value="shower" v-model="selectedOptions">
                            <label for="shower">Душ</label>
                        </div>
                        <div class="cloakroom common">
                            <input type="checkbox" name="cloakroom" id="cloakroom" value="cloakroom" v-model="selectedOptions">
                            <label for="cloakroom">Раздевалка</label>
                        </div>  
                        <div class="parking common">
                            <input type="checkbox" name="parking" id="parking" value="parking" v-model="selectedOptions">
                            <label for="parking">Парковка</label>
                        </div>
                        
                        <div class="water common">
                            <input type="checkbox" name="water" id="water" value="water" v-model="selectedOptions">
                            <label for="water">Вода</label>
                        </div>
                        <div class="ball common">
                            <input type="checkbox" name="balls" id="balls" value="balls" v-model="selectedOptions">
                            <label for="balls">Мячи</label>
                        </div>
                        <div class="shirtfront common">
                            <input type="checkbox" name="shirtfronts" id="shirtfronts" value="shirtfronts" v-model="selectedOptions">
                            <label for="shirtfronts">Манишка</label>
                        </div>
                        <div class="sauna common">
                            <input type="checkbox" name="sauna" id="sauna" value="sauna" v-model="selectedOptions">
                            <label for="sauna">Сауна</label>
                        </div>
                        <div class="bar common">
                            <input type="checkbox" name="bar-cafe" id="bar-cafe" value="bar-cafe" v-model="selectedOptions">
                            <label for="bar-cafe">Бар/Кафе</label>
                        </div>
                        <div class="pump common">
                            <input type="checkbox" name="pump" id="pump" value="pump" v-model="selectedOptions">
                            <label for="pump">Насос</label>
                        </div>
                        <div class="tribune common">
                            <input type="checkbox" name="tribunes" id="tribunes" value="tribunes" v-model="selectedOptions">
                            <label for="tribunes">Трибуна</label>
                        </div>
                        <div class="heating common">
                            <input type="checkbox" name="heating" id="heating" value="heating" v-model="selectedOptions">
                            <label for="heating">Отопление</label>
                        </div>
                        <div class="conditioner common">
                            <input type="checkbox" name="conditioner" id="conditioner" value="conditioner" v-model="selectedOptions">
                            <label for="conditioner">Кондиционер</label>
                        </div>
                        <div class="training-equipment common">
                            <input type="checkbox" name="training-equipment" id="training-equipment" value="training-equipment" v-model="selectedOptions">
                            <label for="training-equipment">Тренировочный инвентарь</label>
                        </div>
                        <div class="toilet common">
                            <input type="checkbox" name="toilet" id="toilet" value="toilet" v-model="selectedOptions">
                            <label for="toilet">Туалет</label>
                        </div>
                        <div class="lighting common">
                            <input type="checkbox" name="lighting" id="lighting" value="lighting" v-model="selectedOptions">
                            <label for="lighting">Освещение</label>
                        </div>
                        <div class="sporting-goods common">
                            <input type="checkbox" name="sporting-goods" id="sporting-goods" value="sporting-goods" v-model="selectedOptions">
                            <label for="sporting-goods">Спорттовары</label>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:button>
            <div class="save__btn">
                <div class="btn" :class="{'active':selectedOptions.length}" @click.stop="setInfrastructure()">Применить</div>
            </div>
        </template>
        </edit-popup>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import EditPopup from './EditPopup.vue'
import axios from 'axios';
export default {
    data(){
        return{ 
            clicked: false,
            options:['shower', 'cloakroom', 'parking', 'water', 'balls', 'shirtfronts', 'sauna', 'bar-cafe', 'pump', 'tribunes', 'heating', 'conditioner', 'training-equipment', 'toilet', 'lighting', 'sporting-goods'],
            selectedOptions: [],
            url: window.location.origin.replace('playfields.', '')
        }
    },
    computed: {...mapState('facility', ['facility'])},
    created(){
        this.setValues();
    },
    methods: {
        closePopup(){
            this.clicked = false;
             this.setValues();
        },
        async setInfrastructure(){
            let sendData = {}
            this.options.map(e=>{return {[e]: this.selectedOptions.includes(e)}}).forEach(e=>sendData = {...sendData, ...e});
            await axios.post(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${this.facility.id}/update-data`, {
                infrastructure: sendData 
                },
                {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`
                }
            }).then(e=>this.$store.dispatch('facility/setFacilityInfr', e.data.facility.infrastructure));
            this.clicked = false;
        },
        setValues(){
            this.selectedOptions = Object.keys(this.facility.infrastructure).filter(e=>this.facility.infrastructure[e]);
        },
        getValue(option){
            switch(option){
                case "shower":
                    return 'Душ';
                case "cloakroom":
                    return "Раздевалка";
                case "parking":
                    return "Паркинг";
                case "water":
                    return "Вода";
                case "balls":
                    return "Мячи";
                case "shirtfronts":
                    return "Манишки";
                case "sauna":
                    return "Сауна";
                case "bar-cafe":
                    return "Бар/кафе";
                case "pump":
                    return "Насос";
                case "tribunes":
                    return "Трибуны";
                case "heating":
                    return "Отопление";
                case "conditioner":
                    return "Кондиционер";
                case "training-equipment":
                    return "Тренировочный инвентарь";
                case "toilet":
                    return "Туалет";
                case "lighting":
                    return "Освещение";
                case "sporting-goods":
                    return "Спортивные товары"; 
            }
        }
    },
    components: {EditPopup}
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
    &__infrastructure{
        background: #fff;
        box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
        max-height: 567px;
        .value{ 
            color: rgba(0, 0, 0, 0.6);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
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
    &__inner{
        display: grid;
        grid: auto/ auto auto;
        .common{
            display: flex;
            align-items: center;
            height: 20px;
            margin-bottom: 20px;
            input{
                margin-right: 7px;
            }
        }
    }
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
.infr__option{
    display: flex;
    word-break: break-all;
    color: rgba(0, 0, 0, 0.6);
    align-items: center;
    .option{
        margin-right: 5px;
    }
    .circle{
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #c4c4c4;
        margin-right: 5px;
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