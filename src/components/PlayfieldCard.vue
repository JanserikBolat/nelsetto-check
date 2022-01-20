<template>
    <div class="playfieldCard" @click="goToPlayfield()">
        <div class="playFieldCard__inner">
            <div class="firstLine">
                <p class="playfield__name">{{playfield.pf_name}}</p>
                <i class="fas fa-chevron-right"></i>
            </div>
            <div class="playfield__description line1">{{getIndoor}} {{getSurface}}</div>
            <div class="playfield__description line2">{{getFormat}}{{getLengthWidth}}</div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['playfield'],
    methods: {
        goToPlayfield(){
            this.$store.dispatch('playfield/setPlayfield', this.playfield)
            this.$emit('goToPlayfield', this.playfield.id);
        }
    },
    computed: {
        getSurface(){
            let surface = '';
            switch(this.playfield.surf_type){
                case 0:
                    surface='Трава.';
                    break;
                case 1:
                    surface='Искусственная трава.';
                    break;
                case 2:
                    surface='Паркет.';
                    break;
                case 3:
                    surface='Грунт.';
                    break;
                case 4:
                    surface='Песок.';
                    break;
                case 5: 
                    surface='Бетон.';
                    break
                case 6:
                    surface='Резина.';
                    break;
                default:
                    surface = 'Не указан.'
            }
            return surface;
        },
        getIndoor(){
            return this.playfield.indoor?'Крытая.':'Открытая.';
        },
        getFormat(){
            return this.playfield.format?`${this.playfield.format}x${this.playfield.format}.`:'Не указан.'
        },
        getLengthWidth(){
            return `${this.playfield.length}м x ${this.playfield.width}м.`
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
.playfieldCard{
    background: #fff;
    padding: 16px;
    box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
    .firstLine{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
        .playfield__name{
            font-size: 16px;
        }
        i{
            color: rgba(0, 0, 0, 0.6);
        }
    }
    .playfield__description{
        color: rgba(0, 0, 0, 0.6);
    }
}
</style>