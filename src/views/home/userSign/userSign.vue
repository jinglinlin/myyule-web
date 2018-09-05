<template>
    <wxc-popup :show="key"
               popup-color="rgba(0,0,0,0.5)"
               pos="bottom"
               height="1334"
               @wxcPopupOverlayClicked="hide">
      <div @click="hide" class="sign-wrapper">
      <div class="userSign">
        <div class="top">
          <image :src="imgUrl+'BG.png'" class="bg"></image>
          <text class="title">每天登录乐币奖励</text>
          <div class="coins">
            <text class="font-89 coin-text">+ 5</text>
            <text class="font-34 coin-text" style="padding-bottom:10px">乐币</text>
          </div>
          <text class="top-tip">完成每日任务获得更多乐币哟</text>
        </div>
        <div class="content">
          <div v-if="missionData.object" v-for="(item,index) in 4" :key="index" class="item">
            <div class="item-left">
              <div :class="['part-1',missionData.object.serialSignDay>index?'active':'']"></div>
              <div :class="['part-2',missionData.object.serialSignDay>index?'active':'']"></div>
              <!-- <div :class="['part-3',missionData.object.serialSignDay>index+1?'active':'']"></div> -->
            </div>
            <text :class="['text',missionData.object.serialSignDay>index?'activeFont':'']">第{{index+1}}天</text>
            <text v-if="missionData.missionResult" :class="['day',missionData.object.serialSignDay>index?'':'activeFont']">获得{{missionData.missionResult[0].reward}}乐币</text>
          </div>
        </div>
        <div @click="go" class="getMisson"><text class="misson-text">去领取</text></div>
        
      </div>
      <text @click="hide" class="close iconfont">&#xe61a;</text>
      </div>
    </wxc-popup>
</template>
<script>
import { WxcPopup } from "weex-ui";
import mixins from "../../../mixins";
import { startNewWebView } from "../../../api/weex";
var storage = weex.requireModule("storage");
export default {
  mixins: [mixins],
  props: {
    missionData: {}
  },
  components: { WxcPopup },
  data() {
    return {
      key: false,
      // missionData: {
      //   object: {
      //     serialSignDay: 1
      //   },
      //   missionResult: [{ reward: 12 }]
      // }
    };
  },
  methods: {
    show() {
      this.key = true;
    },
    hide() {
      this.key = false;
    },
    go() {
      this.key = false;
      if (!this.key) {
        this.push2("/views/userInfo/myMission", "");
      }
    }
  }
};
</script>
<style scoped>
.iconfont {
  font-family: iconfont;
}
/* 公告 */
.font-34 {
  font-size: 34px;
  line-height: 34px;
}
.font-89 {
  font-size: 89px;
  line-height: 89px;
}
.font-80 {
  font-size: 80px;
  line-height: 80px;
}

.close {
  font-size: 80px;
  color: #fff;
  margin-top: 40px;
  margin-bottom: 40px;
}
.sign-wrapper {
  width: 750px;
  height: 1334px;
  justify-content: flex-end;
  padding-bottom: 60px;
  align-items: center;
}
/* 奖励 */
.userSign {
  width: 560px;
  /* height: 969px; */
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: #fff;
  margin-top:40px;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 560px;
  height: 343px;
  background-color: #ee1c41;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
.title {
  width: 560px;
  text-align: center;
  font-size: 32px;
  padding-top: 46px;
  padding-bottom: 41px;
  color: #fff;
}
.coins {
  width:250px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.coin-text {
  color: #fff;
  font-weight: bold;
  padding-left: 10px;
  padding-right: 10px;
}
.top{
  align-items: center;
  justify-content: center;
}
.top-tip {
  width: 560px;
  text-align: center;
  font-size: 24px;
  color: #fff;
  padding-top: 52px;
  padding-bottom: 43px;
}
.content {
  padding-left: 85px;
  padding-right: 88px;
}
.part-1 {
  height: 50px;
  width: 3px;
  background-color: #ececec;
  margin-left: 6.5px;
}
.part-2 {
  width: 15px;
  height: 15px;
  background-color: #ececec;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.part-3 {
  height: 15px;
  width: 3px;
  background-color: #ececec;
  margin-left: 7px;
}
.item {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.text {
  padding-top: 30px;
  font-size: 26px;
  color: #b5b5b5;
  padding-right: 87px;
  padding-left: 29px;
}
.day {
  padding-top: 30px;
  padding-left: 29px;
  font-size: 24px;
}
.getMisson {
  background-color: #ee1c41;
  width: 290px;
  height: 88px;
  margin-left: 145px;
  margin-right: 145px;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  margin-top: 20px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
}
.misson-text {
  color: #fff;
  font-size: 38px;
}
.activeFont {
  color: #666;
}
.active {
  background-color: #ee1c41;
}
</style>
