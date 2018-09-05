<template>
  <div class="activity-noitce">
    <!-- 用户信息 -->
    <!-- <div class="user-info" @click="push2('/views/myPlace/myPlace',{mobile:item.mobile})">
      <div class="left">
        <div class="user-pic">
          <image class="image-view img-vip" resize="cover" :src="item.user.icon?('http://media2.myyule.cn/'+item.user.icon):'http://www.myyule.com/images/head-02.jpg'" placeholder="http://www.myyule.com/images/head-02.jpg"></image>
        </div>
        <div class="info">
          <text class="info-text font-26">{{item.user.nickname}}</text>
          <text class="font-22 info-text color-gray">{{noticeTime(item.createtime)}}</text>
        </div>
      </div>
      <div class="right">
        <text class="iconfont font-30">&#xe61e;</text>
        <text class="seeNum color-gray font-22">{{item.seeNum}}</text>
      </div>
    </div> -->
    <div class="activity-banner">
        <image class="image-view img-bg" resize="cover" :src="((item.logo).substr(0,4)!=='http'?'http://media2.myyule.cn/':'')+(item.logo)" ></image>
        <div class="activity-static">
          <text class="static-text">{{activeState(item)}}</text>
        </div>
    </div>
    <div class="activity-content">
      <div class="activity-title">
        <text  class="title-text font-32">{{item.title}}</text>
        <div class="type">
          <text class="color-pink font-18">{{item.actType}}</text>
        </div>
      </div>
      <div class="content-1">
        <div class="adress">
          <text class="iconfont feeType-text">&#xe609;{{item.address}}</text>
        </div>
      </div>
      <div class="content-2"> 
        <div class="time">
          <text class="iconfont feeType-text">&#xe63f;{{item.starttime.substr(0,10)}} - {{item.endtime.substr(0,10)}}</text>
        </div>
      </div>
      <div class="content-3"> 
        <div class="feeType">
          <text class="feeType-text iconfont" v-if="item.feeType ==0">&#xe615;免费</text>
          <text class="feeType-text iconfont" v-if="item.feeType ==1">&#xe615;收费</text>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mixins from "../../mixins";
export default {
  mixins:[mixins],
  props:{
    item:{}
  },
  methods:{
    activeState(item) {
      let itime = new Date();
      let stime = new Date(item.starttime.replace(new RegExp(/-/gm) ,"/"));
      let etime = new Date(item.endtime.replace(new RegExp(/-/gm) ,"/"));
      console.log(Number(stime));
      if (Number(stime) > Number(itime)) {
        return "即将开始";
      } else if (Number(itime) > Number(etime)) {
        return "已结束";
      } else {
        return "进行中";
      }
    },
  }
}
</script>
<style src="../../assets/style/index.scss">
</style>
<style scoped>
/*图标*/
.iconfont {
  font-family: iconfont;
}
.user-info {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 35px;
  padding-bottom: 30px;
  padding-left: 30px;
  padding-right: 10px;
}
.left,
.right {
  flex-direction: row;
  align-items: center;
}
.seeNum {
  margin-left: 10px;
}
.user-pic {
  width: 90px;
  height: 90px;
  background-color: #d9d9d9;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  overflow: hidden;
}
.img-vip {
  width: 90px;
  height: 90px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.activity-noitce{
  height:622px;
}
.activity-banner {
  position: relative;
  height: 380px;
  background-color: #d9d9d9;
  overflow: hidden;
  /* border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px; */
}
.img-bg {
  position: absolute;
  width: 710px;
  height: 380px;
  top: 0;
  left: 0;
}
.feeType-text {
  line-height: 40px;
  font-size: 22px;
  color: #828282;
  padding-left: 10px;
}
.icon-img {
  width: 44px;
  height: 44px;
}
.info-text {
  line-height: 28px;
  padding-top: 10px;
}
.activity-static {
  width: 480px;
  height: 57px;
  justify-content: center;
  align-items: center;
  transform: rotate(-45deg);
  transform-origin: 180px 260px;
  background-color: #fff;
}
.static-text {
  font-size: 26px;
}
.activity-content {
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  overflow: hidden;
}
.content-1,
.content-2,
.content-3 {
  padding-bottom: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.adress,
.time,
.feeType {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.title-text {
  lines: 1;
  width:500px;
  text-overflow:ellipsis;
}
.info {
  padding-left: 10px;
}
.img-vip {
  width: 90px;
  height: 90px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.activity-title {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
}
.pic {
  width: 90px;
  height: 90px;
  background-color: #d9d9d9;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  overflow: hidden;
}
.type {
  margin-left: 22px;
  height: 35px;
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
}
.codeImg {
  width: 602px;
  height: 602px;
}
</style>


