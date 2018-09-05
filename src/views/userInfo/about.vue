<template>
  <div class="about">
      <div class="install-title" :style="{paddingTop:source==='iOS'?62:20+'px'}">
            <text @click="pop()" class="iconfont back">&#xe625;</text>
            <text class="title-text iconfont">关于</text>
            <text style="width:44px"></text>
      </div>
    <div class="content">
      <image :src="imgUrl+'about-icon.png'" class="logo"></image>
      <text class="serve">当前版本:{{version}}</text>
    </div>
    <div class="bottom">
      <text class="company">北京宇悦无限文化传播有限公司</text>
      <text class="serve">Copyright @2013 Myyule All Rights Reserved</text>
      <!-- <text>音乐随身行服务协议</text> -->
    </div>
  </div>
</template>
<script>
import mixins from "../../mixins";
export default {
  mixins: [mixins],
  beforeCreate(){
    this.fontIcon();
  },
  mounted(){
    this.putPageUrlLog(1102)
  },
  methods: {
    minibarRightButtonClick() {}
  }
};
</script>
<style scoped>
.iconfont {
  font-family: iconfont;
}
/* 导航 */
.install-title {
  position: relative;
  margin-bottom: 10px;
  background-color: #fff;
  width: 750px;
  height: 150px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
  padding-left:20px;
  padding-right:20px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
.title-text{
  line-height: 100px;
  text-align: center;
  font-size: 36px;
}
.about {
  width: 750px;
  height: 1334px;
  background-color: #fff;
}
.back {
  color: #ee1c41;
  font-size: 45px;
}
.logo{
  width:309px;
  height:246px;
  margin-top:90px;
  margin-left:220px;
}
.bottom{
  position: absolute;
  top:1000px;
  width:750px;
}
.company{
  color:#828282;
  font-size:34px;
  text-align: center; 
  padding-top:5px;
}
.serve{
  color:#828282;
  padding-top:5px;
  font-size:22px;
  text-align: center;
}
</style>
