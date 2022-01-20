<template>
  <div class="order_logs">
    <template v-for="log in logs">
      <order-history-card :log="log" :key="log.id"/>
    </template>
  </div>
</template>

<script>
import OrderHistoryCard from "./OrderHistoryCard";
export default {
  components: {OrderHistoryCard},
  props: ['logs']
}
</script>

<style scoped>

</style>