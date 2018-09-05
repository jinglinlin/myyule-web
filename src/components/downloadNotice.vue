<template>
  <div v-if="webVersion" class="download"  :class="[type=='myPlace'?'downBackground':'downloadblack']">
    <div class="head-app">
      <image class="pic-app" :src='imgUrl+"myyule_app.png"'></image>
      <text class="font-26 app-name">校园随身行-校园音乐社区</text>
    </div>
    <div class="load"  @click="loadApp">
      <text class="font-26 loadtext">立即下载</text>
    </div>
  </div>
</template>
<script>
import mixins from "../mixins";
export default {
  mixins: [mixins],
  props:{
    type:{}
   },
  methods:{
      loadApp(){
          this.shareEvent();
      }
  }
}
</script>
<style src="../assets/style/index.scss">
</style>
<style scoped>
.download{
  position:fixed;
  top:0;
  left:0;
  width:750px;
  height:108px;
  /*background-color:rgba(0,0,0,0.3);*/
  /*background-color:#000000;*/
  padding-left:35px;
  padding-right:35px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.downBackground{
  background-color:rgba(0,0,0,0.3);

}
.downloadblack{
  background-color:#000000;
}
  .head-app{
    height: 108px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

  }
  .pic-app{
    width: 80px;
    height: 80px;
  }
  .app-name{
    color: #ffffff;
    margin-left:24px;
    font-family:"Microsoft YaHei"

  }
  .load{
    color:#FFFFFF;
    width:200px;
    height:50px;
    font-weight:bold;
    background-color:#EE1C41;
    justify-content: center;
    align-items: center;

    border-top-left-radius:10px;
    border-top-right-radius:10px;
    border-bottom-left-radius:10px;
    border-bottom-right-radius:10px;
  }
  .loadtext{
    color:#FFFFFF;
    font-weight:bold;
    font-family:"Microsoft YaHei"

  }
</style>
