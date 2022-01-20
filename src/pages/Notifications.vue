<template>
  <div class="notifications">
      <div class="notifications_header">
        <div class="back-btn" @click.stop="back()">
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.91009 1.91705L3.84009 8.00105L9.91009 14.0841L8.04109 15.951L0.0900879 8.00105L8.04109 0.0500507L9.91009 1.91705Z" fill="black"/>
          </svg>
        </div>
        <p class="title">Уведомления</p>
      </div>
      <div class="notifications_cards">
        <template v-for="n in notifications">
          <notification-card :notification="n" :key="n.id" />
        </template>
      </div>
    <bottom-menu />
  </div>
</template>

<script>
import axios from 'axios';
import NotificationCard from '../components/NotificationCard'
import BottomMenu from "../components/BottomMenu";
export default {
  data(){
    return{
      notifications: [],
      url: window.location.origin.replace('playfields.', ''),
    }
  },
  mounted() {
    axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/notifications`, {
      headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
    }).then((res)=>this.notifications = res.data.notifications);
  },
  methods: {
    back(){
      this.$router.go(-1);
    }
  },
  components: {
    BottomMenu,
    NotificationCard
  }
}
</script>

<style lang="scss" scoped>
.notifications{
  &_header{
    display: flex;
    align-items: center;
    padding: 8px;
    background: #fff;
    margin-bottom: 16px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04);
    .back-btn{
      width: 42px;
      height: 42px;
      border-radius: 50%;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 12px;
    }
      .title{
        font-weight: 500;
        font-size: 20px;
        line-height: 32px;
      }
   }
  &_cards{
    padding-bottom: 49px;
  }
}
</style>