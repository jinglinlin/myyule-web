<template>
  <div class="topicResult">
    <image :src="imgSrc+item.images" resize="cover"></image>
  </div>
</template>
<script>
import mixins from '../../mixins'
export default {
  mixins:[mixins],
  props:{
    item:{}
  }
}
</script>
<style src="../../assets/style/index.scss">
</style>
<style scoped>

</style>
