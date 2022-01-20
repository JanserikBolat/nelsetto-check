<template>
  <div class="history-cards">
    <template v-for="(log, index) in logs">
      <history-card :log="log" :key="index" />
    </template>
  </div>
</template>

<script>
import HistoryCard from "./HistoryCard";
export default {
  components: {HistoryCard},
  props: ['logs']
}
</script>

<style scoped>

</style>