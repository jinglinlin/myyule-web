<!--现场活动-->
<template>
  <div class="second-container111">
   <!--  <div class="head-top"></div> -->
    <div class="top" :style="{marginTop:source==='iOS'?62:20+'px'}">
      <image class="reImage-view" :src='imgUrl+"back.png"' @click="pop()" ></image>
      <text class="title font-32">{{formData.actType}}活动</text>
    </div>
    <div class="now-title">
      <text class="title-text">活动列表</text>
    </div>
    <scroller class="now-box">
      <div v-for="(item,index) in activityData" :key="index" class="clubActivity-item" @click="toLayout(item)">
        <div class="activity-banner">
          <div class="img-show">
            <image class="image-view" resize="cover" :src='item.logo'></image>
          </div>
          <div class="activity-static">
            <text class="judge-text" v-if="item.judge === 0">{{stateText1}}</text>
            <text class="judge-text" v-if="item.judge === 1">{{stateText2}}</text>
            <text class="judge-text" v-if="item.judge === 2">{{stateText3}}</text>
          </div>
        </div>
        <div class="activity-content" :class="[platform==='iOS'?'shadow':'']">
          <div class="activity-title">
            <text class="act-text font-32">{{item.title}}</text>
          </div>
          <div class="content-1">
            <div class="adress">
              <div class="img">
                <img class="image-view1" :src='imgUrl+"adress.png"' />
              </div>
              <text class="fix-width">{{item.address}}</text>
            </div>
          </div>
          <div class="content-2"> 
            <div class="time">
              <div class="img">
                <img class="image-view1" :src='imgUrl+"time.png"' />
              </div>
              <text class="fix-width">{{item.createtime}}-{{item.endtime}}</text>
            </div>
          </div>
          <div class="content-3"> 
            <div class="feeType">
              <div class="img">
                <img class="image-view1" :src='imgUrl+"feeType.png"' />
              </div>
              <span class="feeType-text" v-if="item.feeType==0">免费</span>
              <span class="feeType-text" v-if="item.feeType!=0">{{item.fee}}.00</span>
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <!--<div class="nav-list">
        <text class="list-text"v-for="(item,index) in tagList" :key="index">{{item.text}}</text>
    </div>-->
  </div>
</template>

<script>
import mixins from "../../mixins";
import { getActivity } from "../../api/activity.js";
import { getCookie } from "../../utils/cookie.js";
var storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
export default {
  components: {},
  mixins: [mixins],
  data() {
    return {
      platform: "",
      stateText1: "即将开始",
      stateText2: "进行中",
      stateText3: "已结束",
      nowDay: "",
      activityData: [],
      active: 1,
      activityLength: "",
      formData: {
        actType: "",
        pageNo: 1
      }
    };
  },

  beforeCreate() {
    this.fontIcon();
  },
  created() {
    //获取平台信息
    this.platform = weex.config.env.platform;
    console.log(weex.config.env.platform);
    //获取传参
    storage.getItem("data", event => {
      this.formData.actType = JSON.parse(event.data).actType;
      this.request(this.formData);
    });
  },
mounted(){
    // 数据埋点
    this.putPageUrlLog(1602);
    },
  methods: {
    _back() {
      this.pop();
    },
    //下拉刷新
    fetchPage(event) {
      this.formData.pageNo++;
      if (this.activityLength < 10) {
        return;
      } else {
        this.request(this.formData);
      }
      console.log(this.activityLength);
    },
    //  活动主页
    toLayout(item) {
      //    this.$router.push('activityLayout')
      this.push2("/views/activity/active_layout/active_detail", {
        resId: item.resId
      });
    },
    request(data) {
      // 获取活动列表
      getActivity(data, { token: this.mobile })
        //      getActivity({
        //        appid: this.appid,
        //        feeType:this.feeType,
        //        actType:this.actType
        //      })
        .then(res => {
          if (res.status == 0) {
            this.activityLength = res.object.length;
            this.activityData = res.object
              ? this.activityData.concat(res.object)
              : [];
            console.log(this.activityData.length);
            for (let i = 0; i < this.activityData.length; i++) {
              if (this.activityData[i].logo.substr(0, 4) != "http") {
                this.activityData[i].logo =
                  "http://media2.myyule.cn/" + this.activityData[i].logo;
              }
              var nowTime = res.object[i].currentTime,
                lastTime = nowTime.substr(0, 16);
              var date1 = this.activityData[i].starttime;
              var date2 = this.activityData[i].endtime;
              this.activityData[i].judge = "";
              if (lastTime < date1) {
                this.activityData[i].judge = 0;
              } else if (date2 >= lastTime && lastTime >= date1) {
                this.activityData[i].judge = 1;
              } else if (date2 < lastTime) {
                this.activityData[i].judge = 2;
              }
            }
          } else {
            modal.toast({
              message: res.desc,
              duration: 1
            });
          }
        })
        .catch(err => {});
    }
  }
};
</script>

<style scope>
.font-32 {
  font-size: 32px;
  line-height: 32px;
}
.second-container111 {
  width: 750px;
  flex: 1;
}
.img {
  width: 40px;
  height: 40px;
}
.reImage-view {
  position: absolute;
  left: 15px;
  top: 10px;
  width: 50px;
  height: 50px;
}
.image-view1 {
  width: 40px;
  height: 40px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
.head-top {
  width: 750px;
  height: 50px;
  background-color: #fff;
  top: 0;
  left: 0;
  position: fixed;
}
.top {
  top: 0px;
  width: 750px;
  left: 0;
  background-color: #fff;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-bottom: 22px;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 22px;
  border-bottom-style: solid;
  border-bottom-color: #d9d9d9;
  border-bottom-width: 1px;
  position: fixed;
}
.re_icon {
  position: absolute;
  left: 15px;
  top: 25px;
  font-family: iconfont;
  color: #ee1c41;
  font-size: 40px;
  font-weight: bold;
}
.title {
  color: #000;
  line-height: 61px;
}
.now-title {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 20px;
  padding-top: 20px;
  height: 90px;
  margin-top: 124px;
}
.title-text {
  font-weight: 600;
  font-size: 30px;
}
.now-box {
  width: 750px;
  flex: 1;
  height: 840px;
}
.clubActivity-item {
  width: 750px;
  height: 280px;
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
}
.activity-banner {
  position: relative;
  width: 375px;
  height: 280px;
  border-radius: 10px;
  overflow: hidden;
}
.img-show {
  position: absolute;
  left: 0px;
  width: 370px;
  height: 280px;
}
.image-view {
  width: 375px;
  height: 260px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.activity-static {
  width: 350px;
  background-color: #000;
  text-align: left;
  transform: rotate(-45deg);
  transform-origin: 50% 250%;
  position: absolute;
  opacity: 0.6;
}
.judge-text {
  color: #fff;
  width: 300px;
  height: 57px;
  line-height: 58px;
  text-align: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.activity-content {
  margin-top: 26px;
  height: 210px;
  position: relative;
  width: 338px;
  background-color: #fff;
  border-bottom-right-radius: 15px;
  border-top-right-radius: 15px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
}
.shadow {
  box-shadow: 3px 0px 5px 1px #757575;
}
.content-1 {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.content-2 {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.content-3 {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.adress {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.time {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.feeType {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.fix-width {
  width: 270px;
  lines: 1;
  line-height: 40px;
  font-size: 22px;
  color: #828282;
}
.feeType-text {
  line-height: 40px;
  font-size: 22px;
  color: #828282;
}
.activity-title {
  flex-direction: row;
  align-items: bottom;
  padding-left: 10px;
  padding-bottom: 10px;
  margin-top: 5px;
}
.act-text {
  width: 298px;
  lines: 1;
}
.type {
  width: 100px;
  height: 35px;
  border-width: 2px;
  border-style: solid;
  border-color: #000;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  margin-left: 30px;
}
.type-text {
  line-height: 33px;
  text-align: center;
}
.nav-list {
  width: 375px;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: auto;
  margin-right: auto;
  justify-content: space-between;
  flex-direction: row;
}
.active {
  color: #ee1c41;
  padding-bottom: 9px;
  border-bottom-width: 4px;
  border-bottom-style: solid;
  border-bottom-color: #ee1c41;
}
.list-text {
  text-align: center;
  display: inline-block;
  font-size: 30px;
}
</style>
