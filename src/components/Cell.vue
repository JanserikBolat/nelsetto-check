<template>
    <div class="timetable__cell"
         :class="{'reserved': value.isReserved, 'intersect': value.is_pending==='intersect', 'no-intersect': value.is_pending==='no-intersect'}"
        @click.stop="handleClick()"
         :style="getWidth"
    >
            {{value.value}}
    </div>
</template>
<script>
export default {
    props: ['field', 'index', 'value', 'nextBooking'],
    methods: {
        handleClick(){
            if(!this.value.isReserved){
                this.$emit('makeOrder');
            }
            else{
                this.$emit('showInfoAboutOrder', this.value.booking_id)
            }
        }
    },
    computed: {
      isSameBooking(){
        if(this.value.isReserved&&this.nextBooking.isReserved) {
          return this.nextBooking.booking_id === this.value.booking_id;
        }
        else return false;
      },
      isLast(){
        if(this.value.isReserved){
          if(this.value.booking_id!==this.nextBooking.booking_id){
            return true;
          }
          return false;
        }
        return false;
      },
      getWidth(){
        if(this.isSameBooking){
          return 'display: none;'
        }
        else if(this.isLast){
          return `width: ${this.value.amount*50-1}px; margin-left:1px; background-color: ${this.value.color?"#53A2FF":"#182E57"};color: #fff;`
        }
        return `width:49px; margin-left: 1px;`
      }
    }

}
</script>
<style lang="scss" scoped>
    .timetable__cell{
        height: 100%;
        background-color: #fff;
        font-family: 'Roboto', sans-serif;
        font-size: 12px;
        line-height: 20px;
        color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        overflow: hidden;
    }
    .reserved{
        background:  #A8A8A8;
    }
    .no-intersect{
        background: #F3E887;
        border: 1px solid #5CBBF6;
    }
    .intersect{
        background: #FC6161;
        border: 1px solid #5CBBF6;
    }
</style>