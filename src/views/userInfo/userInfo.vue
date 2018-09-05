<template>
<wxc-popup :show="isBottomShow"
            @wxcPopupOverlayClicked="hide"
            pos="left"
            width="572">
  <div class="userInfo">
    <div class="top">
      <div class="top-bg">
        <image src="http://wap.myyule.teamshub.com/web-icon/slider-bg.png" style="height:329px;width:572px"></image>
      </div>
      <div class="user">
        <div class="user-left">
          <div class="user-img">
            <image resize="cover" class="image" @click="push2('/views/userInfo/myInfo',{userData:userInfo})" :src="'http://media2.myyule.cn/'+userInfo.icon" alt="" placeholder="http://www.myyule.com/images/head-02.jpg" style="width:120px;height:120px"></image>
            <image v-if="userInfo.userLevel>0" class="vip" :src="imgUrl+'vip'+userInfo.userLevel+'.png'" ></image>
          </div>
          <div class="user-info">
            <text class="user-info-title">{{userInfo.nickname}}</text>
            <div class="user-msg">
              <text v-if="!userInfo.userType" class="font-22 info-text">{{userInfo.schoolName}}</text>
              <text v-if="userInfo.userType" class="font-22 info-text">{{userInfo.schoolName}}</text>
               <image v-for="index in 14" v-if="userInfo.certification==index" class="mark" :src="imgUrl+'song'+index+'.png'" ></image>
            </div>
          </div>
        </div>
      </div>
      <div class="nav">
        <div @click="push2('/views/home/lookMore/songList',{type:'down'})" class="down item">
          <text class="font-36 iconfont color-white">&#xe637;</text>
          <text class="nav-text">下载</text>
        </div>
        <div @click="push2('/views/home/lookMore/songList',{type:'nearly'})" class="history item">
          <text class="font-36 iconfont color-white">&#xe61c;</text>
          <text class="nav-text">最近播放</text>
        </div>
        <div @click="push2('/views/home/lookMore/songList',{type:'collect'})" class="collect item">
          <text class="font-36 iconfont color-white">&#xe663;</text>
          <text class="nav-text">收藏歌曲</text>
        </div>
      </div>
    </div>
    <div class="slider-content">
      <div @click="push2('/views/userInfo/myPoint','')" class="myPoints">
        <text class="font-80 iconfont">&#xe615;</text>
        <text class="title">我的乐币</text>
        <text class="font-22">100乐币可兑换VIP/月</text>
      </div>
      <div v-if="!userInfo.userType" @click="applyMusician()" class="application">
        <text class="font-80 iconfont">&#xe700;</text>
        <text class="title">申请音乐人</text>
      </div>
      <div v-if="userInfo.userType" class="my-poke">
        <text class="font-80 iconfont">&#xe66b;</text>
        <text class="title color-gray">我的钱包</text>
        <text class="color-gray font-22">开发中...</text>
      </div>
    </div>
    <!-- <div v-if="userInfo.userType" class="examine">
        <text class="font-60 iconfont">&#xe62f;</text>
      <div class="examine-content">
        <text class="title3">最新数发单曲审核中</text>
    </div> -->
    <div class="slider-content no2">
      <div v-if="!userInfo.userType" @click="push2('/views/userInfo/myMission','')"  class="daily-tasks">
        <text class="font-60 iconfont">&#xe60f;</text>
        <text class="slider-title">每日任务</text>
      </div>
      <div v-if="userInfo.userType" @click="push2('/views/userInfo/businessState','')"   class="joint-work">
        <text class="font-60 iconfont">&#xe63b;</text>
        <text class="slider-title">商务合作状态</text>
      </div>
      <div @click="openCenter()" class="applications">
        <text class="font-60 iconfont">&#xe603;</text>
        <text class="slider-title">应用中心</text>
      </div>
      <div class="open-vip">
        <text class="font-60 iconfont">&#xe601;</text>
        <text class="slider-title">开通会员VIP</text>
        <text class="color-gray font-22 Ing">开发中...</text>
      </div>
    </div>
    <div class="advice">
      <text class="font-60 iconfont color-pink advice-icon">&#xe633;</text>
      <div @click="adivce()" class="advice-content">
        <text class="title2 color-pink">意见反馈</text>
        <text class="color-gray font-22">反馈可抽奖1次,如采纳精美礼品赠送</text>
      </div>
    </div>
  <wxc-loading :show="isShow" :need-mask="true"></wxc-loading>
  </div>
    <!-- <div :class="['slider-bottom',!userInfo.userType?'slider-active':'']"> -->
    <div class="slider-bottom slider-active">
      <div @click="push2('/views/userInfo/myInstall','')" class="install">
        <text class="font-40 iconfont">&#xe614;</text>
        <text class="install-text">设置</text>
      </div>
      <div @click="login()" class="change-user">
        <text class="font-40 iconfont">&#xe6df;</text>
        <text class="install-text">切换账号</text>
      </div>
    </div>
</wxc-popup>
</template>

<script>
import { getIntroduce, putGetCollection } from "../../api/userInfo";
import { WxcLoading,WxcPopup } from "weex-ui";
import { openAppCenter, toLogin, openChat,startNewWebView } from "../../api/weex";
import mixins from "../../mixins";
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
export default {
  mixins: [mixins],
  components: { WxcPopup, WxcLoading },
  props: {
    userInfo: {}
  },
  data() {
    return {
      isBottomShow: false,
      width: 572,
      isShow: false,
      userType: "musician"
    };
  },
  methods: {
    show() {
      this.isBottomShow = true;
    },
    hide() {
      this.isBottomShow = false;
    },
    applyMusician() {
      if (!this.isShow) {
        this.isShow = true;
        getIntroduce(
          {
            introduceType: "musician"
          },
          { token: this.mobile }
        )
          .then(res => {
            this.isShow = false;
            if (res.status == 0) {
              modal.confirm(
                {
                  message: res.object.content,
                  okTitle: "确定",
                  cancelTitle: "取消",
                  duration: 1
                },
                function(value) {
                  if(value == '确定'){
                  startNewWebView({url:'http://www.myyule.com/',hideTitle:'1'});
                  }
                }
              );
            } else {
              modal.toast({
                message: res.desc,
                duration: 1
              });
              console.log(res.desc);
            }
          })
          .catch(err => {});
      }
    },
    // 打开应用中心
    openCenter() {
      this.miniHidder();
      openAppCenter();
    },
    // 收藏
    collection() {
      putGetCollection(
        { pageNo: 1, pageSize: 10, resType: "song", mobile: this.mobile },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 打开登录
    login() {
      modal.confirm(
        {
          message: "确定切换账号么 ?",
          okTitle: "确定",
          cancelTitle: "取消",
          duration: 0.3
        },
        function(value) {
          if (value === "确定") {
            storage.removeItem("mobile");
            toLogin({ loginOut: "1" });
          }
        }
      );
    },
    // 意见反馈
    adivce() {
      openChat({ chatacct: "gz_8fa4423a74ac489f", chattype: "3" });
    }
  }
};
</script>

<style src="../../assets/style/index.scss">
</style>
<style scoped>
.iconfont {
  font-family: iconfont;
}
.Ing {
  text-align: center;
  padding-top: 16px;
}
.userInfo {
  background-color: #fff;
}
.top {
  position: relative;
  height: 329px;
}
.myPoints,
.application,
.my-poke,
.daily-tasks,
.joint-work,
.applications,
.open-vip {
  justify-content: center;
  align-items: center;
}
.user {
  width: 572px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 64px;
  padding-bottom: 64px;
  padding-left: 49px;
  padding-right: 35px;
  z-index: 2;
}
.mark {
  width: 44px;
  height: 44px;
  margin-left: 10px;
}
.banner-logo {
  height: 351px;
  width: 572px;
  filter: blur(10px);
}
.user-left {
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.range {
  font-size: 60px;
  line-height: 120px;
}
.user-img {
  position: relative;
  margin-left: 20;
  margin-right: 20px;
  width: 120px;
  height: 120px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color: #d9d9d9;
}
.image {
  width: 120px;
  height: 120px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.vip {
  position: absolute;
  width: 44px;
  height: 44px;
  bottom: 0;
  right: 0;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color: #ee1c41;
  justify-content: center;
  flex-direction: row;
  align-items: flex-end;
}
/* p {
  line-height: 44px;
  color: rgb(246, 227, 159);
} */
.range {
  position: absolute;
  right: -5px;
  top: -5px;
  font-size: 24px;
  color: #fff;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  width: 48px;
  height: 48px;
  text-align: center;
  line-height: 48px;
  background-color: #ee1c41;
}
.user-info{
  width:300px;
}
.user-info-title {
  color: #fff;
  lines:1;
  text-overflow:ellipse;
  white-space: nowrap;
}
.info-text {
  padding-bottom: 18px;
  color: #ececec;
}
.user-msg {
  position: relative;
  flex-direction: row;
  align-items: flex-end;
}
.info-text {
  padding: 0;
}
.mc-icon {
  position: absolute;
  bottom: 0;
  right: -45px;
}
.nav {
  z-index: 2;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.item {
  flex-direction: row;
  align-items: center;
  padding-top: 18px;
  padding-bottom: 18px;
}
.nav-text {
  color: #fff;
  padding-left: 13px;
  font-size: 26px;
}
.top-bg {
  position: absolute;
  width: 572px;
  left: 0;
  top: 0;
}
.slider-content {
  align-items: flex-start;
  padding-top: 45px;
  padding-bottom: 23px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
  flex-direction: row;
  justify-content: space-around;
}
.no2 {
  padding-top: 38px;
  padding-bottom: 21px;
}
.slider-title {
  padding-top: 26px;
  font-size: 26px;
}
.examine-image {
  margin-left: auto;
  margin-right: auto;
  width: 100px;
  height: 100px;
}
.title {
  padding-top: 12px;
  padding-bottom: 13px;
  text-align: center;
  font-size: 26px;
}
.title3 {
  padding-bottom: 0;
  padding-top: 0;
  text-align: center;
  padding-left: 26px;
  padding-right: 21px;
}
.title2 {
  padding-bottom: 13px;
}
.examine {
  padding-left: 26px;
}
.advice,
.examine {
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
  padding-top: 25px;
  padding-bottom: 24px;
}
.advice-title {
  padding-bottom: 14px;
}
.advice-icon {
  margin-left: 30px;
  margin-right: 21px;
  color: #ee1c41;
}
.slider-bottom {
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #ececec;
  /* position: absolute;
  bottom: 0;
  left: 0; */
  width: 572px;
  height: 76px;
  flex-direction: row;
}
.install,
.change-user {
  width: 285px;
  height: 76px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.install {
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: #ececec;
}
.install-text {
  margin-left: 19px;
  font-size: 26px;
}
.vip {
  text-align: center;
}
.n1 {
  line-height: 32px;
}
.n2 {
}
</style>
