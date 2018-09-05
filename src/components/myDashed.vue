<template>
  <div class="dashed">
    <div v-for="item in 100" :key="item" class="item"></div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style src="../assets/style/index.scss">
</style>
<style scoped>
.dashed{
  width:710px;
  overflow:hidden;
  flex-direction: row;
  justify-content: space-between;
  align-items:center;
}
.item{
  width:10px;
  height:2px;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #cecece;
  margin-left:5px;
  margin-right:5px;
}
</style>
